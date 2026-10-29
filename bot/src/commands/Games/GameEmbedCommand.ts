import {
  ActionRowBuilder,
  EmbedBuilder,
  Message,
  SelectMenuBuilder,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class GameEmbedCommand extends BaseCommand {
  constructor() {
    super("gameEmbed", "Games", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id !== "200403567129919488") {
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle("Houst Games")
      .setDescription(
        `> O Torneio da Houst Games é um evento de jogos que reúne jogadores em busca de competição e diversão. Com uma premiação de 300 reais, o torneio atrai jogadores de diferentes níveis de habilidade, desde amadores até profissionais.

        > Além da premiação em dinheiro, o torneio também oferece cargo para os players que se destacarem em suas modalidades.`
      )
      .setFooter({
        text: "Utilize o dropdown abaixo para selecionar o jogo e montar seu time",
      })
      .setColor("#313338");

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`gametype_select`)
        .setPlaceholder("Selecione um jogo para seu time")
        .addOptions([
          {
            label: "Valorant",
            value: "Valorant_team",
            emoji: { name: "valorant", id: "1107850455205298216" },
          },
          {
            label: "Brawlhalla",
            value: "Brawlhalla_team",
            emoji: { name: "Brawlhalla", id: "1107850434963587142" },
          },
          {
            label: "LoL",
            value: "LoL_team",
            emoji: { name: "lol", id: "1107850406161285200" },
          },
          {
            label: "Freefire",
            value: "Freefire_team",
            emoji: { name: "FreeFire", id: "1107850390919188480" },
          },
        ])
    );
    try {
      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (err) {
      console.log(err);
    }
  }
}
