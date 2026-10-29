import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import "moment-timezone";
import { GuildCoins } from "../../typeorm/entities/GuildCoins";
export default class DivorceCommand extends BaseCommand {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("divorce", "Coins", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.bot) return;
    const guildId = message.guild?.id;
    if (!guildId) {
      return;
    }
    if (1 === 1) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    const userTrack = await this.guildCoins.findOne({
      where: {
        guildId: guildId,
        userId: message.author.id,
      },
    });
    if (userTrack && userTrack.marriedTo) {
      const marriedTo = userTrack.marriedTo;
      const marriedTrack = await this.guildCoins.findOne({
        where: {
          guildId: guildId,
          userId: marriedTo,
        },
      });
      if (marriedTrack && marriedTrack.marriedTo === message.author.id) {
        const divorceEmbed = new EmbedBuilder()
          .setTitle(`Divórcio ${message.guild.name}`)
          .setDescription(
            `Chegou o fim...\n💔 ${message.author} e <@${marriedTo}> não são mais casados. Um capítulo doloroso se encerra.`
          )
          .setColor(0xff69b4);
        marriedTrack.marriedAt = null;
        marriedTrack.marriedTo = null;
        userTrack.marriedAt = null;
        userTrack.marriedTo = null;
        await this.guildCoins.save(marriedTrack);
        await this.guildCoins.save(userTrack);
        return message.channel
          .send({ embeds: [divorceEmbed] })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 15000);
          })
          .catch((err) => console.log(err));
      }
    } else {
      const noUserError = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Você não é casado(a)!**"
        );
      return message.channel
        .send({ embeds: [noUserError] })
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
