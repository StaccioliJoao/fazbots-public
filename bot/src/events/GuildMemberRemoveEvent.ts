// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildsPd } from "../typeorm/entities/GuildsPd";
import { AppDataSource } from "../typeorm/dataSource/dataSource";

export default class GuildMemberRemoveEvent extends BaseEvent {
  constructor(
    private readonly pdRepository = AppDataSource.getRepository(GuildsPd)
  ) {
    super("guildMemberRemove");
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = client.configs.get(member.guild.id);
    if (!config) return;
    const Pds = await this.pdRepository.find({
      where: {
        guildId: member.guild.id,
      },
    });
    let isSomeonePd = false;
    var correctPd;
    for (let userPd of Pds) {
      const userPds = userPd.pdList;
      for (let pd of userPds) {
        if (pd.userId === member.id) {
          isSomeonePd = true;
          correctPd = userPd.userId;
          break;
        }
      }
    }
    console.log(correctPd);
    if (isSomeonePd && correctPd) {
      const userPds = await this.pdRepository.findOne({
        where: {
          guildId: member.guild?.id,
          userId: correctPd,
        },
      });
      const index = userPds!.pdList.findIndex((pd) => pd.userId === member!.id);
      const newPds = userPds?.pdList;
      newPds?.splice(index, 1);
      try {
        await this.pdRepository.save({
          ...userPds,
          pdList: newPds,
        });
      } catch (error) {}
    }
    if (config.entryLogChannelId) {
      const channel = member.guild.channels.cache.get(
        config.entryLogChannelId
      ) as TextChannel;
      if (channel && config.botId === client.user?.id) {
        const leaveEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("<:leave:1017861513526124605> Saiu do servidor")
          .addFields({
            name: "<:member:1016520230572396544> Membro:",
            value:
              "<@" +
              member +
              "> `" +
              member.user.username +
              "#" +
              member.user.discriminator +
              "`",
          })
          .setTimestamp();
        try {
          channel.send({ embeds: [leaveEmbed] });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}
