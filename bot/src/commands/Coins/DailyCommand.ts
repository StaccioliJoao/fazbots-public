import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildMessageCounter } from "../../typeorm/entities/GuildMessageCounter";
import moment from "moment-timezone";
import "moment-timezone";
import { GuildCoins } from "../../typeorm/entities/GuildCoins";
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
function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

export default class DailyCommand extends BaseCommand {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("daily", "Coins", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const currentTime = new Date().toISOString();
    if (message.author.bot) return;
    const guildId = message.guild?.id;
    if (!guildId) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    const trackedUser = await this.guildCoins.findOne({
      where: {
        guildId: guildId,
        userId: message.author.id,
      },
    });
    if (trackedUser) {
      const lastUsed = new Date(trackedUser.dailyTime).getTime();
      const nowTime = new Date(currentTime).getTime();
      const cooldown = new Date(trackedUser.cooldown).getTime();
      if (cooldown > nowTime) {
        return;
      }
      const diff = Math.abs(nowTime - lastUsed);
      const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
      if (lastUsed < nowTime) {
        const userCoins = Number(trackedUser.coins) + Number(50);
        const futureTime = new Date(currentTime);
        futureTime.setHours(futureTime.getHours() + 24);
        const futureTimeCooldown = new Date(currentTime);
        futureTimeCooldown.setSeconds(futureTimeCooldown.getSeconds() + 5);
        const nextTime = futureTime.toISOString();
        const nextCooldown = futureTimeCooldown.toISOString();
        await this.guildCoins.save({
          ...trackedUser,
          coins: userCoins,
          dailyTime: nextTime,
          cooldown: nextCooldown,
        });
        const collectedEmbed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setDescription(
            `**Você coletou seu bônus diário de 50 moedas!**\nAgora você possui **${userCoins} Houst Coins** em sua carteira!`
          );
        return message.channel
          .send({ embeds: [collectedEmbed], content: `${message.author}` })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          })
          .catch((err) => console.log(err));
      } else {
        const commandcooldown = shortEnglishHumanizer(diff, {
          units: ["h", "m", "s"],
          round: true,
          spacer: "",
        });
        const noUserError = new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(
            `**<:erro:1017575876264743012> | Você já coletou seu bônus diário, tente novamente em ${commandcooldown}!**`
          );
        const futureTimeCooldown = new Date(currentTime);
        futureTimeCooldown.setSeconds(futureTimeCooldown.getSeconds() + 5);
        const nextCooldown = futureTimeCooldown.toISOString();
        await this.guildCoins.save({
          ...trackedUser,
          cooldown: nextCooldown,
        });
        return message.channel
          .send({ embeds: [noUserError], content: `${message.author}` })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          })
          .catch((err) => console.log(err));
      }
    }
  }
}
