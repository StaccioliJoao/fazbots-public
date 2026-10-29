import {
  Message,
  PermissionFlagsBits,
  PermissionsBitField,
  TextChannel,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { GuildBanLog } from "../../typeorm/entities/GuildBan";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
const { EmbedBuilder } = require("discord.js");

export default class BanCommand extends BaseCommand {
  constructor(
    private readonly banLogRepository = AppDataSource.getRepository(GuildBanLog)
  ) {
    super("ban", "mod", ["Ban"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    let banChannelId = config?.banLogChannelId || "";
    const permittedRoles = config?.banPermRoles || [];
    const banLogsChannel = message.guild?.channels.cache.get(
      banChannelId
    ) as TextChannel;
    if (
      message.member?.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member?.roles.cache.some((role) =>
        permittedRoles.includes(role.id)
      )
    ) {
      const [memberId, ...rest] = args;
      var reason = rest.join(" ");
      if (reason === "") {
        reason = "Motivo não informado.";
      }
      try {
        const user = await client.users.fetch(
          memberId.replace("<@", "").replace(">", "")
        )!;
        const banMember = message.guild?.members.cache.get(user.id);
        if (banMember) {
          const authorRole = message.member.roles.highest;
          const targetRole = banMember.roles.highest;
          if (targetRole.comparePositionTo(authorRole) >= 0) {
            const errorEmbed = new EmbedBuilder()
              .setColor(0xff0000)
              .setDescription(
                "**<:erro:1017575876264743012> | Você não possui permissão para banir este usuário!**"
              );
            return message.channel
              .send({ embeds: [errorEmbed] })
              .then((msg) => {
                setTimeout(() => msg.delete(), 5000);
              })
              .catch((err) => console.log(err));
          }
        }
        const banEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("<:ban:1016516904006979625> | Banimento")
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            {
              name: "<:member:1016520230572396544> Membro Banido:",
              value:
                user.username +
                "#" +
                user.discriminator +
                " `" +
                user.username +
                "#" +
                user.discriminator +
                "`",
              inline: true,
            },
            {
              name: "<:admin:1016521117093077122> Administrador:",
              value:
                `<@${message.author.id}> ` +
                "`" +
                message.author.username +
                "#" +
                message.author.discriminator +
                "`",
              inline: true,
            },
            { name: "<:motivo:1016520872368017418> Motivo:", value: reason }
          )
          .setTimestamp();
        try {
          await user.send({ embeds: [banEmbed] });
        } catch (err) {}
        await message.guild?.members.ban(user, {
          deleteMessageDays: 7,
          reason,
        });
        const guildBanLog = this.banLogRepository.create({
          guildId: message.guildId!,
          bannedMemberID: user.id,
          issuedBy: message.author.id,
          reason,
          issuedDate: new Date(),
        });
        await this.banLogRepository.save(guildBanLog);

        try {
          banLogsChannel?.send({ embeds: [banEmbed] });
        } catch (err) {
          console.log(err);
        }
        try {
          await message.channel
            .send({ embeds: [banEmbed] })
            .then((msg) => {
              setTimeout(() => msg.delete(), 10000);
            })
            .catch((err) => console.log(err));
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}
