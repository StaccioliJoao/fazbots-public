import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class InformationCommand extends BaseCommand {
  constructor() {
    super("information", "Information", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id === "200403567129919488") {
      const infoEmbed = new EmbedBuilder()
        .setTitle(
          "<:za_houst:1089313394554830961>  **Welcome, wel...wel... b-bem-bem-vindos à HOUST!**"
        )
        .setDescription(
          "Eu sou o **Jhonny**, o anfitrião da nossa comunidade! Espero que você esteja bem. E aí, me conta como conheceu o nosso servidor no meu privado? Na verdade, vamos deixar para depois, agora vou falar um pouco daqui para você.\n\nA Houst é um servidor do discord que preza o bom convívio e instiga o enriquecimento de amizades e relacionamentos virtuais.\n\n<:za_houst:1089313385184764006>  **Conheça o nosso servidor através desse tour que eu fiz para você:**\n\n> ・Faça amigos nas calls públicas ou no <#1097884278391578714>;\n> ・Poste a sua melhor foto no nosso <#1075283840580464760>;\n> ・Divirta-se no <#1078152577495080960>;\n> ・Torne-se um membro em <#1075283766030905354>;\n> ・Visite as nossas áreas disponíveis em <#1081709039836205166>."
        )
        .setColor(0x313338)
        .setImage(
          "https://media.discordapp.net/attachments/1071273239881449552/1130146244052926636/welmcome-1.png?width=1025&height=395"
        )
        .setFooter({
          text: "Clique no botão abaixo para ver mais informações sobre o servidor.",
          iconURL:
            "https://cdn.discordapp.com/attachments/1084508346901602414/1090445019552423997/ezgif.com-video-to-gif.gif",
        });
      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Normas")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("information_rules")
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Group")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("information_group")
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Registro")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("Register")
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Impulsione")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("information_boost")
      );
      await message.channel.send({ embeds: [infoEmbed], components: [row] });
    }
  }
}
