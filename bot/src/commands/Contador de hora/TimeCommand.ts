import { EmbedBuilder, GuildMember, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildHourCounter } from "../../typeorm/entities/GuildHourCounter";
import ems from "enhanced-ms";
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
export default class TimeCommand extends BaseCommand {
  constructor(
    private readonly guildsHourCounter = AppDataSource.getRepository(
      GuildHourCounter
    )
  ) {
    super("time", "Contador de hora", ["tempo"]);
  }
  getHighestRole(member: GuildMember, roles: string[]) {
    const memberRoles = member.roles.cache;
    let highestRole = memberRoles.last();
    for (const role of roles) {
      let currentRole = memberRoles.get(role);
      if (currentRole && currentRole.position > highestRole!.position) {
        highestRole = currentRole;
      }
    }
    return highestRole;
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    if (!config?.hourCounterRoles) {
      return;
    }
    const member =
      (message.mentions.members?.first() as GuildMember) ||
      (message.guild?.members.cache.get(args[0]) as GuildMember) ||
      (message.member as GuildMember);
    if (
      member.id === message.member!.id &&
      message.member?.roles.cache.hasAny(...config!.hourCounterRoles)
    ) {
      const userInfo = await this.guildsHourCounter.findOne({
        where: {
          userId: message.author.id,
          guildId: message.guild?.id,
        },
      });
      if (userInfo) {
        if (member.voice.channel?.id) {
          if (
            new Date(userInfo.leaveTime) < new Date(userInfo.joinTime) &&
            new Date(userInfo.joinTime) !== new Date(0) &&
            new Date(userInfo.leaveTime) !== new Date(0)
          ) {
            const role = this.getHighestRole(
              message.member,
              config!.hourCounterRoles
            );
            const hours = shortEnglishHumanizer(userInfo.totalTime, {
              units: ["h", "m", "s"],
              round: true,
              spacer: "",
            });
            const diff2 = Math.abs(
              new Date().getTime() - new Date(userInfo.dateRole).getTime()
            );
            const roleHours = Math.round(diff2 / (1000 * 60 * 60 * 24)) + 1;
            const diff = Math.abs(
              new Date().getTime() - new Date(userInfo.joinTime).getTime()
            );
            const hoursSavedTotal = userInfo.totalTime + diff;
            const hourEmbed = new EmbedBuilder()
              .setTitle(
                `<:time:1071248032525471867> Horas em call de ${message.member.displayName}`
              )
              .setDescription(
                `Cargo:${role}\nCall: **<#${
                  member.voice.channel.id
                }>**\nTempo Salvo: **${hours}**\nTempo Acumulado: **${shortEnglishHumanizer(
                  diff,
                  {
                    units: ["h", "m", "s"],
                    round: true,
                    spacer: "",
                  }
                )}**\nTempo Total: **${shortEnglishHumanizer(hoursSavedTotal, {
                  units: ["h", "m", "s"],
                  round: true,
                  spacer: "",
                })}**\nTempo com o cargo: **${roleHours}D**`
              )
              .setTimestamp()
              .setColor(0x3a4ff0)
              .setThumbnail(message.member.displayAvatarURL());
            await message.channel.send({ embeds: [hourEmbed] }).then((msg) => {
              setTimeout(() => msg.delete(), 15000);
            });
          } else {
            const role = this.getHighestRole(
              message.member,
              config!.hourCounterRoles
            );
            const hours = shortEnglishHumanizer(userInfo.totalTime, {
              units: ["h", "m", "s"],
              round: true,
              spacer: "",
            });
            const diff2 = Math.abs(
              new Date().getTime() - new Date(userInfo.dateRole).getTime()
            );
            const roleHours = Math.round(diff2 / (1000 * 60 * 60 * 24)) + 1;
            const hourEmbed = new EmbedBuilder()
              .setTitle(
                `<:time:1071248032525471867> Horas em call de ${message.member.displayName}`
              )
              .setDescription(
                `Cargo:${role}\nTotal de horas em call: **${hours}**\nTempo com o cargo: **${roleHours}D**`
              )
              .setTimestamp()
              .setColor(0x3a4ff0)
              .setThumbnail(message.member.displayAvatarURL());
            await message.channel.send({ embeds: [hourEmbed] }).then((msg) => {
              setTimeout(() => msg.delete(), 15000);
            });
          }
        } else {
          const role = this.getHighestRole(
            message.member,
            config!.hourCounterRoles
          );
          const hours = shortEnglishHumanizer(userInfo.totalTime, {
            units: ["h", "m", "s"],
            round: true,
            spacer: "",
          });
          const diff2 = Math.abs(
            new Date().getTime() - new Date(userInfo.dateRole).getTime()
          );
          const roleHours = Math.round(diff2 / (1000 * 60 * 60 * 24)) + 1;
          const hourEmbed = new EmbedBuilder()
            .setTitle(
              `<:time:1071248032525471867> Horas em call de ${message.member.displayName}`
            )
            .setDescription(
              `Cargo:${role}\nTotal de horas em call: **${hours}**\nTempo com o cargo: **${roleHours}D**`
            )
            .setTimestamp()
            .setColor(0x3a4ff0)
            .setThumbnail(message.member.displayAvatarURL());
          await message.channel.send({ embeds: [hourEmbed] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
          });
        }
      } else {
        const hourEmbed = new EmbedBuilder()
          .setTitle(
            `<:time:1071248032525471867> Horas em call de ${message.member.displayName}`
          )
          .setDescription(`Usuário não está no nosso banco de horas!`)
          .setTimestamp()
          .setColor(0x3a4ff0)
          .setThumbnail(message.member.displayAvatarURL());
        await message.channel.send({ embeds: [hourEmbed] }).then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });
      }
    } else if (
      message.member?.roles.cache.hasAny(...config!.hourCounterPerms) &&
      member
    ) {
      const userInfo = await this.guildsHourCounter.findOne({
        where: {
          userId: member.id,
          guildId: message.guild?.id,
        },
      });
      if (userInfo) {
        const role = this.getHighestRole(member, config!.hourCounterRoles);
        const hours = shortEnglishHumanizer(userInfo.totalTime, {
          units: ["h", "m", "s"],
          round: true,
          spacer: "",
        });
        const diff2 = Math.abs(
          new Date().getTime() - new Date(userInfo.dateRole).getTime()
        );
        const roleHours = Math.round(diff2 / (1000 * 60 * 60 * 24)) + 1;
        const hourEmbed = new EmbedBuilder()
          .setTitle(
            `<:time:1071248032525471867> Horas em call de ${member.displayName}`
          )
          .setDescription(
            `Cargo:${role}\nTotal de horas em call: **${hours}**\nTempo com o cargo: **${roleHours}D**`
          )
          .setTimestamp()
          .setColor(0x3a4ff0)
          .setThumbnail(message.member.displayAvatarURL());
        await message.channel.send({ embeds: [hourEmbed] }).then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });
      } else {
        const hourEmbed = new EmbedBuilder()
          .setTitle(
            `<:time:1071248032525471867> Horas em call de ${member.displayName}`
          )
          .setDescription(`Usuário não está no nosso banco de horas!`)
          .setTimestamp()
          .setColor(0x3a4ff0)
          .setThumbnail(member.displayAvatarURL());
        await message.channel.send({ embeds: [hourEmbed] }).then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });
      }
    }
  }
}
