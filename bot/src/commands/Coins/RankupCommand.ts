import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildCoins } from "../../typeorm/entities/GuildCoins";
interface RolePrice {
  coins: number;
  stars: number;
}

function getCurrentAndNextRank(userRoles: string[]) {
  // Get sorted user role IDs
  let userRankIds = Object.keys(rolePrices)
    .filter((id) => userRoles.includes(id))
    .sort();

  // Get current rank
  let currentRankId = userRankIds[userRankIds.length - 1];

  // Check if current rank is highest role
  let currentIndex = Object.keys(rolePrices).indexOf(currentRankId);
  let isHighestRole = currentIndex === Object.keys(rolePrices).length - 1;

  if (isHighestRole) {
    // User is at highest role, no next rank
    return {
      currentRankId,
      nextRankId: null,
    };
  } else {
    // Get next rank
    let nextRankId = Object.keys(rolePrices)[currentIndex - 1];
    return {
      currentRankId,
      nextRankId,
    };
  }
}

const rolePrices: { [key: string]: RolePrice } = {
  "1100036353082789940": {
    coins: 12000,
    stars: 24,
  },
  "1112844301748162731": {
    coins: 10000,
    stars: 21,
  },
  "1095781181653532725": {
    coins: 8000,
    stars: 18,
  },
  "1095774201379557416": {
    coins: 7000,
    stars: 15,
  },
  "1095774210770612385": {
    coins: 6000,
    stars: 12,
  },
  "1100035842023628840": {
    coins: 5000,
    stars: 9,
  },
  "1095774218588790784": {
    coins: 4000,
    stars: 6,
  },
  "1095774227384250449": {
    coins: 3000,
    stars: 0,
  },
  "1095771245787762860": {
    coins: 2000,
    stars: 0,
  },
  "1095771281145733192": {
    coins: 1500,
    stars: 0,
  },
  "1095771291144945695": {
    coins: 1200,
    stars: 0,
  },
  "1095774169507057684": {
    coins: 600,
    stars: 0,
  },
  "1095771309415350272": {
    coins: 500,
    stars: 0,
  },
  "1093965247339044935": {
    coins: 400,
    stars: 0,
  },
  "1075290196167376920": {
    coins: 350,
    stars: 0,
  },
  "1095771299411939428": {
    coins: 300,
    stars: 0,
  },
  "1075289659942383616": {
    coins: 250,
    stars: 0,
  },
  "1075291015671459911": {
    coins: 200,
    stars: 0,
  },
};

export default class RankupCommand extends BaseCommand {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("rankup", "coins", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.bot) return;
    const guildId = message.guild?.id;
    if (!guildId) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    if (!message.member) {
      return;
    }
    const userRoles = message.member.roles.cache.map((role) => role.id);
    const { currentRankId, nextRankId } = getCurrentAndNextRank(userRoles);
    const userCoins = await this.guildCoins.findOne({
      where: {
        guildId: guildId,
        userId: message.author.id,
      },
    });
    if (userCoins && nextRankId) {
      const nextRankPrice = rolePrices[nextRankId];
      if (
        userCoins.coins >= nextRankPrice.coins &&
        userCoins.stars >= nextRankPrice.stars
      ) {
        const coinsLeft = userCoins.coins - nextRankPrice.coins;
        const starsLeft = userCoins.stars - nextRankPrice.stars;
        await this.guildCoins.save({
          ...userCoins,
          coins: coinsLeft,
          stars: starsLeft,
        });
        await message.member.roles.remove(currentRankId);
        await message.member.roles.add(nextRankId);
        const rankupEmbed = new EmbedBuilder()
          .setColor("#00FF00")
          .setDescription(
            `Você desbloqueou um novo cargo ${message.author}! Agora você é <@&${nextRankId}> (anteriormente <@&${currentRankId}>). Bom trabalho!`
          )
          .setTimestamp()
          .setThumbnail(message.author.avatarURL())
          .setTitle(`RankUp de ${message.author.username}`);
        return message.channel
          .send({ embeds: [rankupEmbed] })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 10000);
          })
          .catch((err) => console.log(err));
      } else {
        const coinsMissing = Math.abs(userCoins.coins - nextRankPrice.coins);
        const starsMissing = Math.abs(userCoins.stars - nextRankPrice.stars);
        const rankupError = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription(
            `Cargo Atual: <@&${currentRankId}>\nProximo Cargo: <@&${nextRankId}>\n\nVocê precisa de mais:\n**Coins**: ${coinsMissing}\n**Stars**: ${starsMissing}`
          )
          .setThumbnail(message.author.avatarURL())
          .setTitle(`RankUp de ${message.author.username}`);
        return message.channel
          .send({ embeds: [rankupError] })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          })
          .catch((err) => console.log(err));
      }
    } else {
      const rankupEmbedError = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription(`Você não possui mais cargos para subir com coins!`)
        .setThumbnail(message.author.avatarURL())
        .setTitle(`RankUp de ${message.author.username}`);
      return message.channel
        .send({ embeds: [rankupEmbedError] })
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
