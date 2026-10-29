// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  Interaction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  SelectMenuBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  ThreadChannel,
  AttachmentBuilder,
  PermissionsBitField,
  BaseGuildVoiceChannel,
  GuildChannel,
  ButtonComponent,
} from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildsTeams } from "../typeorm/entities/GuildTeams";
import { ArrayContains } from "typeorm";
import { GuildCoins } from "../typeorm/entities/GuildCoins";
import { DateTime } from "luxon";

export default class InteractionCreateEvent extends BaseEvent {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("interactionCreate");
  }
  async run(client: DiscordClient, interaction: Interaction) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("marry_no-")) {
        const targetUser = interaction.customId.split("-")[2];
        const sentUser = interaction.customId.split("-")[1];
        if (targetUser !== interaction.user.id) {
          return;
        }
        const sentUserTrack = await this.guildCoins.findOne({
          where: {
            guildId: interaction.guild?.id,
            userId: sentUser,
          },
        });
        if (sentUserTrack) {
          const newCoins = Number(sentUserTrack.coins) + Number(100);
          await interaction.message.delete();
          await this.guildCoins.save({
            ...sentUserTrack,
            coins: newCoins,
          });
          return interaction.channel
            ?.send({
              content: `**<@${targetUser}> recusou o pedido de casamento de <@${sentUser}>.**`,
            })
            .then((msg) => {
              setTimeout(() => {
                try {
                  msg.delete();
                } catch (err) {}
              }, 5000);
            })
            .catch((err) => console.log("err"));
        } else {
          return;
        }
      } else if (interaction.customId.startsWith("marry_yes-")) {
        const targetUser = interaction.customId.split("-")[2];
        const sentUser = interaction.customId.split("-")[1];
        if (targetUser !== interaction.user.id) {
          return;
        }
        const sentUserTracks = await this.guildCoins.findOne({
          where: {
            guildId: interaction.guild?.id,
            userId: sentUser,
          },
        });
        const targetUserTracks = await this.guildCoins.findOne({
          where: {
            guildId: interaction.guild?.id,
            userId: targetUser,
          },
        });
        var dt = DateTime.now();
        dt.setLocale("pt-br");
        var newDt = dt.setZone("America/Sao_Paulo");
        if (!targetUserTracks) {
          const save = this.guildCoins.create({
            guildId: interaction.guild?.id,
            userId: targetUser,
            coins: 0,
            msgCount: 0,
            marriedTo: sentUser,
            marriedAt: newDt.valueOf(),
          });
          await this.guildCoins.save(save);
        }
        await this.guildCoins.save({
          ...targetUserTracks,
          marriedTo: sentUser,
          marriedAt: newDt.valueOf(),
        });
        await this.guildCoins.save({
          ...sentUserTracks,
          marriedTo: targetUser,
          marriedAt: newDt.valueOf(),
        });
        await interaction.message.delete();
        return await interaction.channel
          ?.send({
            content: `**Agora <@${targetUser}> e <@${sentUser}> são casados!**`,
          })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          })
          .catch((err) => console.log("err"));
      }
    }
  }
}
