import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildMessageCounter } from "../../typeorm/entities/GuildMessageCounter";
import moment from "moment-timezone";
import "moment-timezone";
export default class MsgrankCommand extends BaseCommand {
  constructor(
    private readonly messageCounterRepository = AppDataSource.getRepository(
      GuildMessageCounter
    )
  ) {
    super("msgrank", "MessageCounter", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    //I want to get the top 25 users in the server for message count of the week
    const brasiliaTimezone = "America/Sao_Paulo";
    const today = new Date();
    const currentWeek = moment(today).tz(brasiliaTimezone).week();
    const guildMessageCounters = await this.messageCounterRepository.find({
      where: {
        guildId: message.guild?.id,
      },
    });
    const currentWeekUsers = guildMessageCounters
      .map((user) => {
        const week = user.week.find((w) => w.week === currentWeek);
        if (week) {
          return {
            userId: user.userId,
            message_count: week.message_count,
            role: user.roleId,
          };
        }
      })
      .filter((user) => user !== undefined)
      .sort((a, b) => b!.message_count - a!.message_count);
    const top25 = currentWeekUsers.slice(0, 25);
    let embedDescription = "";
    let rank = 1;
    for (const user of top25) {
      embedDescription += `${rank}. <@${user!.userId}> - ${
        user?.message_count
      } - <@&${user?.role}>\n`;
      rank++;
    }
    const embed = new EmbedBuilder()
      .setTitle("Ranking de mensagens da semana")
      .setDescription(embedDescription)
      .setColor("#0000ff")
      .setTimestamp()
      .setFooter({
        text: `Comando solicitado por ${message.author.username}`,
        iconURL: message.guild?.iconURL()!,
      });
    await message.channel.send({ embeds: [embed] }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 7500);
    });
  }
}
