import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class CalculadoraCommand extends BaseCommand {
  constructor() {
    super("calculadora", "MTA", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id === "200403567129919488") {
      const calculadoraEmbed = new EmbedBuilder()
        .setTitle(`Calculadora de Missão`)
        .setFooter({
          text: `Utilize o botão abaixo para mandar prova de pagamento da missão`,
        })
        .setDescription(
          `Ao apertar o botão um chat sera criado para você enviar a print da sua missão para calcular seu pagamento.`
        )
        .setColor(0xff0000);
      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`Enviar_missao`)
          .setLabel("Enviar")
          .setStyle(ButtonStyle.Secondary)
      );
      message.channel.send({
        embeds: [calculadoraEmbed],
        components: [row],
      });
    }
  }
}
