import axios from "axios";
import { AttachmentBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildCoins } from "../../typeorm/entities/GuildCoins";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

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

export default class CoinsCommand extends BaseCommand {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("coins", "HoustCoins", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    const guildId = message.guild?.id;
    if (!guildId) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }

    const user = message.author;
    const userCoins = await this.guildCoins.findOne({
      where: {
        guildId: message.guild?.id,
        userId: user.id,
      },
    });
    if (!userCoins) {
      return;
    }

    const canvas = createCanvas(2762, 1198);
    const context = canvas.getContext("2d");
    // Load and register the font
    const fontPath = path.join(__dirname, "Bebas-Regular.ttf");
    registerFont(path.join(__dirname, "Bebas-Regular.ttf"), {
      family: "Bebas Neue",
    });
    const image = await loadImage(
      "https://media.discordapp.net/attachments/1071273239881449552/1078119210451996732/HOUSTCOIONS.png?width=1025&height=445"
    );
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const response = await axios.get(
      user.displayAvatarURL({ extension: "jpg" }),
      { responseType: "arraybuffer" }
    );
    const avatar = await loadImage(Buffer.from(response.data));

    context.font = "bold 150px Bebas Neue";
    context.fillStyle = "#f4eef6";
    context.fillText(
      nFormatter(userCoins.coins, 1).toString(),
      canvas.width / 1.78,
      canvas.height / 1.7
    );
    context.beginPath();
    context.arc(465, 620, 390, 0, Math.PI * 2, true);
    context.lineWidth = 50;
    context.strokeStyle = "#f4eef6";
    context.stroke();
    context.closePath();
    context.clip();
    context.drawImage(avatar, 45, 225, 810, 810);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "profile-image.png",
    });

    await message.channel
      .send({ files: [attachment] })
      .then((msg) => {
        setTimeout(() => msg.delete(), 10000);
      })
      .catch((err) => console.log(err));
  }
}
