import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class VerificarButtonCommand extends BaseCommand {
  constructor() {
    super("verificarButton", "verificar", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id === "200403567129919488") {
      //copy the embed from this discord message 1081655864752087241
      const embed = new EmbedBuilder()
        .setDescription(
          `<:za_houst:1089313396895264808>  **Sistema de Verificação - HOUST**\n\nA verificação é uma forma de impedir fakes no nosso Instagram.\nSe verificando, você ganhará a tag <@&1092260070550683718> e terá acesso livre para postar suas fotos.\n\n**Como faço para me verificar?**\n\n> Para que você seja verificado, basta clicar no botão abaixo e solicitar uma verificação. Você irá apenas ligar a câmera e confirmar sua imagem.`
        )
        .setColor(0x313338)
        .setImage(
          "https://media.discordapp.net/attachments/1084508346901602414/1088914154947092621/verify1.jpg?width=1025&height=395"
        )
        .setFooter({
          text: "Clique no botão abaixo para ver mais informações sobre o servidor.",
          iconURL:
            "https://cdn.discordapp.com/attachments/1084508346901602414/1090445019552423997/ezgif.com-video-to-gif.gif",
        });

      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`criarVerificar`)
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Verificar")
      );
      await message.channel.send({ embeds: [embed], components: [row] });
    }
  }
}
