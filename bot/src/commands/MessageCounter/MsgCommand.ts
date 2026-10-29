import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildMessageCounter } from "../../typeorm/entities/GuildMessageCounter";

export default class MsgCommand extends BaseCommand {
  constructor(
    private readonly messageCounterRepository = AppDataSource.getRepository(
      GuildMessageCounter
    )
  ) {
    super("msg", "MessageCounter", ["mensagens", "msgs", "mensagem"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    //I want to send a embed with the message count of the user and also its rank in the server for message count of the week
    const userTrack = await this.messageCounterRepository.findOne({
      where: {
        guildId: message.guild?.id,
        userId: message.author.id,
      },
    });
    if (userTrack) {
      const week = userTrack.week[userTrack.week.length - 1];
      const msgCount = week.message_count;
      const allUsers = await this.messageCounterRepository.find({
        where: {
          guildId: message.guild?.id,
        },
      });
      //now sort the allUsers array by the message count
      allUsers.sort((a, b) => {
        const aWeek = a.week[a.week.length - 1];
        const bWeek = b.week[b.week.length - 1];
        return bWeek.message_count - aWeek.message_count;
      });
      //now get the index of the user in the array
      const userIndex = allUsers.findIndex(
        (u) => u.userId === message.author.id
      );
      const userRank = userIndex + 1;
      const infoEmbed = new EmbedBuilder()
        .setThumbnail(message.author.avatarURL())
        .setColor("#0000ff")
        .setTitle(
          `<:message:1097752275662950400> | Contador de Mensagens de ${message.author.username}`
        )
        .setDescription(
          `Cargo: <@&${userTrack.roleId}>\nSemana do ano: **${week.week}**\n Mensagens: **${msgCount}**\nRank: **${userRank}**`
        )
        .setTimestamp()
        .setFooter({
          text: `Comando solicitado por ${message.author.username}`,
          iconURL: message.guild?.iconURL()!,
        });
      await message.channel.send({ embeds: [infoEmbed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 7500);
      });
    }
  }
}
