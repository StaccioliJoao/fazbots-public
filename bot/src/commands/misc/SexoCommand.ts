import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class SexoCommand extends BaseCommand {
  constructor() {
    super("sexo", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const targetUser =
      message.mentions.users.first() ||
      message.guild!.members.cache.get(args[0]);
    if (!targetUser) {
      const embed = new EmbedBuilder()
        .setDescription("**Mencione alguem á realizar a solicitação**")
        .setColor(0xff0000);
      await message.channel.send({ embeds: [embed] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
    } else {
      const embed = new EmbedBuilder()
        .setDescription(
          `Boa noite! ${targetUser}, você foi solicitado(a) para fazer um gf com ${message.author}!`
        )
        .setColor(0xff00ff);
      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Sim")
          .setStyle(ButtonStyle.Success)
          .setCustomId(`gf_yes-${message.author.id}-${message.guild?.id}`)
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Não")
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`gf_no-${message.author.id}-${message.guild?.id}`)
      );
      try {
        await targetUser.send({ embeds: [embed], components: [row] });
      } catch (err) {
        console.log(err);
      }
    }
  }
}
