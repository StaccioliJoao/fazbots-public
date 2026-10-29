import { Message, Role } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildHourCounter } from "../../typeorm/entities/GuildHourCounter";
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
export default class TcCommand extends BaseCommand {
  constructor(
    private readonly guildsHourCounter = AppDataSource.getRepository(
      GuildHourCounter
    )
  ) {
    super("tc", "Contador de hora", ["Tc"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    await message.guild?.members.fetch();
    const config = client.configs.get(message.guildId!);
    if (!config?.hourCounterRoles) {
      return;
    }
    if (message.member!.roles.cache.hasAny(...config!.hourCounterPerms)) {
      const role =
        (message.mentions.roles?.first() as Role) ||
        (message.guild?.roles.cache.get(args[0]) as Role);
      if (role) {
        if (config?.hourCounterRoles.includes(role.id)) {
          const allUsers = role.members;
          console.log(allUsers.size);
          const allHours = await this.guildsHourCounter.find({
            where: { guildId: message.guild!.id, roleId: role.id },
          });
          const sortedHours = allHours
            .sort((a, b) => a.totalTime - b.totalTime)
            .reverse();
          var msg = `**Usuário** | **Horas** | **Tempo no Cargo** | **Cargo: ${role}**\n`;
          //send message with 20 users per message
          var currentUsers = 0;
          for (const userHour of sortedHours) {
            const diff2 = Math.abs(
              new Date().getTime() - new Date(userHour.dateRole).getTime()
            );
            var horaCargo = Math.round(diff2 / (1000 * 60 * 60 * 24)) + 1;
            var horaTotal = shortEnglishHumanizer(userHour.totalTime, {
              units: ["h", "m", "s"],
              round: true,
            });
            msg += `<@${userHour.userId}> | ${horaTotal} | ${horaCargo}D\n`;
            currentUsers++;
            if (currentUsers === 20) {
              await message.channel.send(msg);
              msg = "";
              currentUsers = 0;
            }
          }
          const noHoursArray = allUsers.filter((member) => {
            return !sortedHours.some(
              (membroComHoras) => membroComHoras.userId === member.id
            );
          });
          console.log(noHoursArray.size);
          const noHoursMentions = noHoursArray.map((user) => {
            return `<@${user.id}>`;
          });
          const noHoursMentionsText = noHoursMentions.join("\n");
          await message.channel.send(msg);
          await message.channel.send(
            `**----Usuarios sem horas----**\n ${noHoursMentionsText}`
          );
        }
      }
    }
  }
}
