import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import "moment-timezone";
import { GuildCoins } from "../../typeorm/entities/GuildCoins";
import Jimp from "jimp";

export default class MarrystatusCommand extends BaseCommand {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("marrystatus", "Coins", ["mstatus"]);
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
    await message.guild.members.fetch();
    const userTrack = await this.guildCoins.findOne({
      where: {
        guildId: guildId,
        userId: message.author.id,
      },
    });
    if (!userTrack || !userTrack.marriedTo) {
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
    const marriedEmbed = new EmbedBuilder();
    const marriedToUser = message.guild.members.cache.get(userTrack.marriedTo);
    if (!marriedToUser) {
      return;
    }
    const background = await Jimp.read("marry.png");
    var pfp = message.author.displayAvatarURL({
      size: 128,
      extension: "png",
      forceStatic: true,
    });
    var pfp2 = marriedToUser.displayAvatarURL({
      size: 128,
      extension: "png",
      forceStatic: true,
    });
    const pfpImage = await Jimp.read(pfp);
    const pfpImage2 = await Jimp.read(pfp2);
    pfpImage.resize(48, 48);
    pfpImage.circle({ radius: 24, x: 24, y: 24 });
    pfpImage2.resize(48, 48);
    pfpImage2.circle({ radius: 24, x: 24, y: 24 });
    background.composite(pfpImage, 216, 300);
    background.composite(pfpImage2, 295, 300);
    const sendImage = new AttachmentBuilder(
      await background.getBufferAsync(Jimp.MIME_PNG),
      {
        name: "marry_status.png",
      }
    );
    const marriedSince = `<t:${Math.round(userTrack.marriedAt! / 1000)}:R>`;
    marriedEmbed.setColor(0xffc0cb);
    marriedEmbed.setDescription(
      `❤️ ${message.author} é casado há ${marriedSince} com <@${userTrack.marriedTo}>`
    );
    marriedEmbed.setImage(`attachment://${sendImage.name}`);
    return message.channel
      .send({ embeds: [marriedEmbed], files: [sendImage] })
      .then((msg) => {
        setTimeout(() => {
          try {
            msg.delete();
          } catch (err) {}
        }, 8000);
      })
      .catch((err) => console.log(err));
  }
}
