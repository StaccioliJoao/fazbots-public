// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  TextChannel,
} from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildMutes } from "../typeorm/entities/GuildMutes";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { fromMs } from "ms-typescript";

export default class GuildMemberAddEvent extends BaseEvent {
  constructor(
    private readonly muteLogRepository = AppDataSource.getRepository(GuildMutes)
  ) {
    super("guildMemberAdd");
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = client.configs.get(member.guild.id);
    const mutedMemberDB = await this.muteLogRepository.findOne({
      where: {
        guildId: member.guild.id,
        mutedMemberID: member.id,
      },
    });
    if (!config) return;
    if (member.guild.id === "994252260299251803") {
      try {
        const joinEmbed = new EmbedBuilder()
          .setTitle("Boas-Vindas da Comunidade Zero ao Milhão")
          .setColor("#000000")
          .setImage(
            "https://media.discordapp.net/attachments/1052681106207555634/1076960039706820789/BANNER_BOT_DISCORD.jpg"
          )
          .setFooter({
            text: "Clique no link abaixo para entender todos os benefícios.",
          })
          .addFields(
            {
              name: "Leitura Obrigatória",
              value:
                "Seja bem-vindo a Comunidade Zero ao Milhão, é um enorme prazer ter você aqui conosco, isso quer dizer que você faz parte do 1% da população que realmente deseja ter muito sucesso, prosperidade e aqui é o lugar certo.\n\nNessa comunidade você vai encontrar pessoas que podem te ajudar a tirar suas dúvidas sobre o mercado, compartilhar experiências e até a fazer negócios juntos. Por isso entre nessa comunidade de mente aberta, para que você possa aproveitar ao máximo todo o networking disponível.\n\nE um aviso muito importante que eu quero te passar, é que você leia as regras do servidor para evitar qualquer tipo de problemas.",
            },
            {
              name: "Comunidade Privada",
              value:
                "Como você entrou agora, talvez não conheça o curso oficial do servidor, que é a Comunidade Privada, um curso que vai te ensinar tudo o que você precisa para ganhar dinheiro com o mercado digital.\n\nFora que você vai ter vários benefícios no servidor, como fazer divulgações, participar de eventos privados e até tirar dúvidas diretamente com a nossa equipe interna do servidor.",
            }
          );
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Website")
            .setStyle(ButtonStyle.Link)
            .setURL("https://ogringoempreendedor.com/pagina-de-vendas-ec/")
        );
        await member.send({ embeds: [joinEmbed], components: [row] });
      } catch (err) {
        console.log(err);
      }
    }
    if (mutedMemberDB) {
      const mutedRole =
        member.guild.roles.cache.get("1017823204561141770") || "";
      member.roles.add(mutedRole);
    }
    if (config.welcomeChannelId && config.botId === client.user?.id) {
      const channel = member.guild.channels.cache.get(
        config.welcomeChannelId
      ) as TextChannel;
      if (!channel) {
      } else {
        channel
          .send(
            `${config.welcomeChannelMessage.replace(/{member}/g, `${member}`)}`
          )
          .then((msg) => {
            setTimeout(() => msg.delete(), 7000);
          });
      }
    }
    if (config.entryLogChannelId) {
      const channel = member.guild.channels.cache.get(
        config.entryLogChannelId
      ) as TextChannel;
      if (channel) {
        const joinEmbed = new EmbedBuilder()
          .setTitle("<:join:1017860982544023583> Entrou no servidor")
          .setColor(0x00ff00)
          .setTimestamp()
          .addFields(
            {
              name: "<:member:1016520230572396544> Membro:",
              value:
                "<@" +
                member +
                "> `" +
                member.user.username +
                "#" +
                member.user.discriminator +
                "`",
            },
            {
              name: "<a:time:1017825297346867281> Criado há:",
              value: `${fromMs(
                Date.now() - member.user.createdTimestamp
              ).replace("d", "")} dias atrás`,
            }
          );
        try {
          channel.send({ embeds: [joinEmbed] });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}
