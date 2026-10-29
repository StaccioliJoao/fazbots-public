// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanAdd
import { AuditLogEvent, GuildBan, TextChannel } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildBanLog } from "../typeorm/entities/GuildBan";
const { EmbedBuilder } = require("discord.js");

export default class GuildBanAddEvent extends BaseEvent {
  constructor(
    private readonly banLogRepository = AppDataSource.getRepository(GuildBanLog)
  ) {
    super("guildBanAdd");
  }

  async run(client: DiscordClient, ban: GuildBan) {
    const config = client.configs.get(ban.guild.id);
    ban.guild
      .fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd })
      .then(async (logs) => {
        let guildBan = logs.entries
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .first();
        let executor = guildBan?.executor;
        let target = guildBan?.target;
        let reason = guildBan?.reason;
        const banChannelId = config?.banLogChannelId || "";
        const banLogsChannel = ban.guild?.channels.cache.get(
          banChannelId
        ) as TextChannel;
        if (guildBan?.executor?.id !== client.user?.id && !target?.bot) {
          try {
            const guildBanLog = this.banLogRepository.create({
              guildId: ban.guild.id,
              bannedMemberID: target?.id,
              issuedBy: executor?.id,
              reason: reason!,
              issuedDate: new Date(),
            });
            await this.banLogRepository.save(guildBanLog);
            const banEmbed = new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("<:ban:1016516904006979625> | Banimento")
              .addFields(
                {
                  name: "<:member:1016520230572396544> Membro Banido:",
                  value:
                    target?.username +
                    "#" +
                    target?.discriminator +
                    " `" +
                    target?.id +
                    "`",
                  inline: true,
                },
                {
                  name: "<:admin:1016521117093077122> Administrador:",
                  value:
                    `<@${executor?.id}> ` +
                    "`" +
                    executor?.username +
                    "#" +
                    executor?.discriminator +
                    "`",
                  inline: true,
                },
                { name: "<:motivo:1016520872368017418> Motivo:", value: reason }
              )
              .setTimestamp();
            banLogsChannel.send({ embeds: [banEmbed] });
          } catch (error) {
            console.log(error);
          }
        } else if (reason?.includes("Ban via Painel")) {
          try {
            let cleanReason = reason.replace("Ban via Painel", "").split(",");
            const guildBanLog = this.banLogRepository.create({
              guildId: ban.guild.id,
              bannedMemberID: target?.id,
              issuedBy: executor?.id,
              reason: reason!,
              issuedDate: new Date(),
            });
            await this.banLogRepository.save(guildBanLog);
            const banEmbed = new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle("<:ban:1016516904006979625> | Banimento Via Painel")
              .addFields(
                {
                  name: "<:member:1016520230572396544> Membro Banido:",
                  value:
                    target?.username +
                    "#" +
                    target?.discriminator +
                    " `" +
                    target?.id +
                    "`",
                  inline: true,
                },
                {
                  name: "<:admin:1016521117093077122> Administrador:",
                  value:
                    `<@${executor?.id}> ` +
                    "`" +
                    executor?.username +
                    "#" +
                    executor?.discriminator +
                    "`",
                  inline: true,
                },
                {
                  name: "<:dashboard:1017535123610161243> Admin no Site:",
                  value: cleanReason[1].replace("Autor: ", ""),
                },
                {
                  name: "<:motivo:1016520872368017418> Motivo:",
                  value: cleanReason[0],
                }
              )
              .setTimestamp();
            banLogsChannel.send({ embeds: [banEmbed] });
          } catch (error) {
            console.log(error);
          }
        }
      });
  }
}
