import { EmbedBuilder, Message, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildHourCounter } from "../../typeorm/entities/GuildHourCounter";
const {
  pagination,
  ButtonTypes,
  ButtonStyles,
} = require("@devraelfreeze/discordjs-pagination");
const humanizeDuration = require("humanize-duration");
const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}
export default class RankCommand extends BaseCommand {
  constructor(
    private readonly guildsHourCounter = AppDataSource.getRepository(
      GuildHourCounter
    )
  ) {
    super("rank", "Contador de hora", ["top"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    if (!config?.hourCounterRoles) {
      return;
    }
    if (message.member!.roles.cache.hasAny(...config!.hourCounterPerms)) {
      const allHours = await this.guildsHourCounter.find({
        where: { guildId: message.guild!.id },
      });
      const sortedHours = allHours
        .sort((a, b) => a.totalTime - b.totalTime)
        .reverse();
      const chunkedEntries = chunk(sortedHours, 25);
      const embeds = chunkedEntries.map((chunk) => {
        var msg = "";
        for (const userHour of chunk) {
          const diff2 = Math.abs(
            new Date().getTime() - new Date(userHour.dateRole).getTime()
          );
          var horaCargo = Math.round(diff2 / (1000 * 60 * 60 * 24)) + 1;
          var horaTotal = shortEnglishHumanizer(userHour.totalTime, {
            units: ["h", "m", "s"],
            round: true,
          });
          const role = message.guild?.roles.cache.get(userHour.roleId);
          msg += `<@${userHour.userId}> | ${horaTotal} | ${horaCargo}D | ${role?.name}\n`;
        }
        const embed = new EmbedBuilder()
          .setTitle(
            `**Usuário** | **Horas** | **Tempo no Cargo** | **Cargo**\n`
          )
          .setDescription(msg);

        return embed;
      });
      await pagination({
        embeds: embeds /** Array of embeds objects */,
        author: message.author.username,
        message: message,
        time: 40000,
        fastSkip: false,
        ephemeral: true,
        buttons: [
          {
            type: ButtonTypes.previous,
            label: "Anterior",
            style: ButtonStyles.Primary,
          },
          {
            type: ButtonTypes.next,
            label: "Proximo",
            style: ButtonStyles.Success,
          },
        ],
      });
    }
  }
}
