import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import "moment-timezone";
import { GuildCoins } from "../../typeorm/entities/GuildCoins";
export default class MarryCommand extends BaseCommand {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("marry", "Coins", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.bot) return;
    if (1 === 1) {
      return;
    }
    const guildId = message.guild?.id;
    if (!guildId) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    const targetUser =
      (message.guild?.members.cache.get(args[0]) as GuildMember) ||
      (message.mentions.members?.first() as GuildMember);
    if (
      !targetUser ||
      targetUser.id === message.author.id ||
      targetUser.user.bot
    ) {
      const noUserError = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Você deve mencionar um usuário para se casar!**"
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
    const trackSender = await this.guildCoins.findOne({
      where: {
        guildId: guildId,
        userId: message.author.id,
      },
    });

    const trackReceiver = await this.guildCoins.findOne({
      where: {
        guildId: guildId,
        userId: targetUser.id,
      },
    });
    if (!trackReceiver) {
      const save = this.guildCoins.create({
        guildId: guildId,
        userId: targetUser.id,
        coins: 0,
        msgCount: 0,
      });
      await this.guildCoins.save(save);
    }
    if (!trackSender) {
      const noMoneyError = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Para que você possa se casar, é necessário o pagamento de 100 Houst Coins, e infelizmente você não possui a quantidade necessária.**"
        );
      return message.channel
        .send({ embeds: [noMoneyError] })
        .then((msg) => {
          setTimeout(() => {
            try {
              msg.delete();
            } catch (err) {}
          }, 5000);
        })
        .catch((err) => console.log(err));
    }
    const coins = trackSender.coins;
    if (coins < 100) {
      const noMoneyError = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Para que você possa se casar, é necessário o pagamento de 100 Houst Coins, e infelizmente você não possui a quantidade necessária.**"
        );
      return message.channel
        .send({ embeds: [noMoneyError] })
        .then((msg) => {
          setTimeout(() => {
            try {
              msg.delete();
            } catch (err) {}
          }, 5000);
        })
        .catch((err) => console.log(err));
    }
    if (trackSender?.marriedTo || trackReceiver?.marriedTo) {
      const alreadyMarriedError = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Não foi possível casar devido a um dos envolvidos já ser casado. Utilize o comando `hs!divorce`! para se divorciar e liberar a possibilidade de um novo casamento.**"
        );
      return message.channel
        .send({ embeds: [alreadyMarriedError] })
        .then((msg) => {
          setTimeout(() => {
            try {
              msg.delete();
            } catch (err) {}
          }, 5000);
        })
        .catch((err) => console.log(err));
    }

    const newCoins = Number(coins) - Number(100);
    await this.guildCoins.save({
      ...trackSender,
      coins: newCoins,
    });
    const marryEmbed = new EmbedBuilder()
      .setColor(0xffc0cb)
      .setTitle(`Casamento ${message.guild.name}`)
      .setDescription(
        `${targetUser} você aceita o pedido de casamento de ${message.author}?`
      )
      .setFooter({
        text: "Aceite ou recuse o pedido usando os botões abaixo!",
        iconURL: message.guild?.iconURL()!,
      });
    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(
      new ButtonBuilder()
        .setLabel("Sim")
        .setStyle(ButtonStyle.Success)
        .setCustomId(`marry_yes-${message.author.id}-${targetUser.id}`)
    );
    row.addComponents(
      new ButtonBuilder()
        .setLabel("Não")
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`marry_no-${message.author.id}-${targetUser.id}`)
    );
    return message.channel
      .send({
        embeds: [marryEmbed],
        components: [row],
        content: `${targetUser}`,
      })
      .then((msg) => {
        setTimeout(() => {
          try {
            msg.delete();
          } catch (err) {}
        }, 30000);
      })
      .catch((err) => console.log(err));
  }
}
