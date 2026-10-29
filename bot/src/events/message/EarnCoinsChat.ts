import BaseEvent from "../../utils/structures/BaseEvent";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  Message,
  TextChannel,
} from "discord.js";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildMessageCounter } from "../../typeorm/entities/GuildMessageCounter";
import moment from "moment-timezone";
import "moment-timezone";
import { GuildCoins } from "../../typeorm/entities/GuildCoins";

export default class MessageEvent extends BaseEvent {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("messageCreate");
  }

  getHighestRole(member: GuildMember, roles: string[]) {
    const memberRoles = member.roles.cache;
    let highestRole = memberRoles.last();
    for (const role of roles) {
      let currentRole = memberRoles.get(role);
      if (currentRole && currentRole.position > highestRole!.position) {
        highestRole = currentRole;
      }
    }
    return highestRole;
  }

  countUniqueCharacters(str) {
    // Create an empty object to store unique characters
    var uniqueChars = {};

    // Iterate over each character in the string
    for (var i = 0; i < str.length; i++) {
      var char = str[i];

      // If the character is not already in the object, add it
      if (!uniqueChars[char]) {
        uniqueChars[char] = true;
      }
    }

    // Return the count of unique characters
    return Object.keys(uniqueChars).length;
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    const guildId = message.guild?.id;
    if (!guildId) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    const msg = message.content;
    const uniqueChars = this.countUniqueCharacters(msg);
    if (msg.length > 8 || uniqueChars >= 4) {
      const trackedUser = await this.guildCoins.findOne({
        where: { guildId: message.guild?.id, userId: message.author.id },
      });

      if (trackedUser) {
        if (trackedUser.msgCount >= 100) {
          const userCoins = Number(trackedUser.coins) + Number(3);
          await this.guildCoins.save({
            ...trackedUser,
            coins: userCoins,
            msgCount: 0,
          });
        } else {
          const newMsgCount = Number(trackedUser.msgCount) + Number(1);
          await this.guildCoins.save({
            ...trackedUser,
            msgCount: newMsgCount,
          });
        }
      } else {
        const save = this.guildCoins.create({
          guildId: message.guild?.id,
          userId: message.author.id,
          joinTime: undefined,
          coins: 0,
          msgCount: 1,
        });
        await this.guildCoins.save(save);
      }
    }
  }
}
