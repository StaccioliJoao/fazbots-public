import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class SupportButtonCommand extends BaseCommand {
  constructor() {
    super("supportButton", "support", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id === "200403567129919488") {
      const embed = new EmbedBuilder()
        .setDescription(
          `<:lupahost:1089361287579959457> **SUPORTE HOUST**

          > <:xc_houst:1086231428297150516> Ao precisar de ajuda ou fazer alguma reclamação, clique no botão “iniciar” abaixo, e logo após, será criada uma call com seu nome. Suba e aguarde alguém de nossa equipe para te auxiliar quanto ao que precisa;
         
          > <:xc_houst:1086231428297150516> Caso a reclamação seja sobre algum Suporte de nossa equipe, contate os superiores <@852611345689608263> ou <@836998262593683506> .`
        )
        .setFooter({
          text: "Utilize o botão abaixo para entrar em contato com a equipe de suporte.",
        })
        .setColor(0x313338)
        .setImage(
          "https://media.discordapp.net/attachments/1084508346901602414/1089581497108938852/helpme.jpg?width=1025&height=395"
        );

      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`criarCallSupport`)
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Help me")
      );
      await message.channel.send({ embeds: [embed], components: [row] });
    }
  }
}
