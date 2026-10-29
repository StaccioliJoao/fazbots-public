import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildMessageCounter } from "../../typeorm/entities/GuildMessageCounter";

export default class RelatorioCommand extends BaseCommand {
  constructor(
    private readonly messageCounterRepository = AppDataSource.getRepository(
      GuildMessageCounter
    )
  ) {
    super("relatorio", "MessageCounter", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const member =
      message.mentions.members?.first() ||
      message.guild?.members.cache.get(args[0]) ||
      message.member;
    const memberInfo = await this.messageCounterRepository.findOne({
      where: {
        guildId: message.guild?.id,
        userId: member?.id,
      },
    });
    if (!memberInfo) {
      return;
    }
    const relatorioEmbed = new EmbedBuilder()
      .setTitle(`Relatório de ${member?.user.username}`)
      .setColor("#0000ff")
      .setThumbnail(member?.user.avatarURL()!)
      .setTimestamp()
      .setFooter({
        text: `Comando solicitado por ${message.author.username}`,
        iconURL: message.guild?.iconURL()!,
      });
    var embedDescription = "";
    let totalMessages = 0;
    //on the last week write it out in bold
    memberInfo.week.forEach((week) => {
      if (week.week === memberInfo.week[memberInfo.week.length - 1].week) {
        embedDescription += `> **Semana ${week.week}**\nMensagens: **${week.message_count}**\n`;
      } else {
        embedDescription += `> Semana ${week.week}\nMensagens: ${week.message_count}\n`;
      }
      totalMessages += week.message_count;
    });
    embedDescription += `\nTotal de mensagens: **${totalMessages}**`;
    relatorioEmbed.setDescription(embedDescription);
    await message.channel.send({ embeds: [relatorioEmbed] }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 7500);
    });
  }
}
