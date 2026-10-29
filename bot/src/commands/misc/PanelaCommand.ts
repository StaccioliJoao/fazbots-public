import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsPanela } from "../../typeorm/entities/GuildPanela";

export default class PanelaCommand extends BaseCommand {
  constructor(
    private readonly panelaRepository = AppDataSource.getRepository(
      GuildsPanela
    )
  ) {
    super("panela", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    interface RolePermissions {
      [roleId: string]: {
        antban: number;
        ladyGolden: number;
        imagePermissions: number;
        woodPerms: number;
      };
    }
    const perms = {
      "1051998949097095168": {
        antban: 3,
        ladyGolden: 2,
        imagePermissions: 4,
        woodPerms: 3,
      },
      "1075283651987787876": {
        antban: 2,
        ladyGolden: 0,
        imagePermissions: 3,
        woodPerms: 2,
      },
      "1093535888132292770": {
        antban: 1,
        ladyGolden: 0,
        imagePermissions: 1,
        woodPerms: 0,
      },
      "1043218151665565726": {
        antban: 3,
        ladyGolden: 2,
        imagePermissions: 4,
        woodPerms: 0,
      },
      "1082465121881837619": {
        antban: 3,
        ladyGolden: 3,
        imagePermissions: 0,
        woodPerms: 0,
      },
      "1114253447584297031": {
        antban: 2,
        ladyGolden: 0,
        imagePermissions: 2,
        woodPerms: 0,
      },
      "1077288697042575381": {
        antban: 1,
        ladyGolden: 0,
        imagePermissions: 0,
        woodPerms: 0,
      },
      "1088966569348059166": {
        antban: 1,
        ladyGolden: 0,
        imagePermissions: 0,
        woodPerms: 0,
      },
    };
    const guildId = message.guild?.id;
    if (!guildId) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    const member = message.member;
    const memberRolesIds =
      member?.roles.cache.map((role) => role.id).reverse() || [];
    if (memberRolesIds) {
      let highestPermission;
      for (const roleId of memberRolesIds) {
        highestPermission = perms[roleId];
        if (highestPermission) {
          break;
        }
      }
      if (
        highestPermission ||
        message.author.id === "1078140956605431848" ||
        message.author.id === "325329148908273664" ||
        message.author.id === "1116789101312626870"
      ) {
        const panelaEmbed = new EmbedBuilder()
          .setTitle(`Panela de ${message.author.username}`)
          .setColor(0x0000ff);
        const userPanela = await this.panelaRepository.findOne({
          where: {
            guildId: guildId,
            userId: message.author.id,
          },
        });
        if (userPanela) {
          var antBans;
          var ladyGoldens;
          var imagePerms;
          var woodsPerms;
          if (userPanela.antBans.length > 0) {
            antBans = userPanela.antBans.map((antban) => {
              return `\n· <@${antban}>`;
            });
            panelaEmbed.addFields({
              name: "Antbans",
              value: `${antBans}`,
              inline: true,
            });
          } else {
            panelaEmbed.addFields({
              name: "Antbans",
              value: "Nenhum",
              inline: true,
            });
          }
          if (userPanela.ladyGoldens.length > 0) {
            ladyGoldens = userPanela.ladyGoldens.map((ladygolden) => {
              return `\n· <@${ladygolden}>`;
            });
            panelaEmbed.addFields({
              name: "Lady Goldens",
              value: `${ladyGoldens}`,
              inline: true,
            });
          } else {
            panelaEmbed.addFields({
              name: "Lady Goldens",
              value: "Nenhum",
              inline: true,
            });
          }
          if (userPanela.imagePerms.length > 0) {
            imagePerms = userPanela.imagePerms.map((antban) => {
              return `\n· <@${antban}>`;
            });
            panelaEmbed.addFields({
              name: "Perms de Foto",
              value: `${imagePerms}`,
              inline: true,
            });
          } else {
            panelaEmbed.addFields({
              name: "Perms de Foto",
              value: `Nenhum`,
              inline: true,
            });
          }
          if (userPanela.woodPerms.length > 0) {
            woodsPerms = userPanela.woodPerms.map((antban) => {
              return `\n· <@${antban}>`;
            });
            panelaEmbed.addFields({
              name: "Wood",
              value: `${woodsPerms}`,
              inline: true,
            });
          } else {
            panelaEmbed.addFields({
              name: "Wood",
              value: `Nenhum`,
              inline: true,
            });
          }
          await message.channel.send({ embeds: [panelaEmbed] }).then((msg) => {
            setTimeout(() => msg.delete(), 10000);
          });
        } else {
          const save = this.panelaRepository.create({
            guildId: message.guild?.id,
            userId: message.author.id,
          });
          await this.panelaRepository.save(save);
        }
      }
    }
  }
}
