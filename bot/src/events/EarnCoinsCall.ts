// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
import { GuildMember, Role, VoiceState } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildCoins } from "../typeorm/entities/GuildCoins";

export default class WoiceStateUpdateEvent extends BaseEvent {
  constructor(
    private readonly guildCoins = AppDataSource.getRepository(GuildCoins)
  ) {
    super("voiceStateUpdate");
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

  async run(client: DiscordClient, oldState: VoiceState, newState: VoiceState) {
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;
    const guildId = oldState.guild.id || newState.guild.id;
    const member = oldState.member || newState.member;
    const config = client.configs.get(guildId);
    const EARN_RATE = 15;
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    if (member?.user.bot) {
      return;
    }
    if (oldUserChannel === null && newUserChannel !== null) {
      // User Join a voice channel
      const joinTime = new Date().toISOString();
      const trackedUser = await this.guildCoins.findOne({
        where: {
          guildId: guildId,
          userId: member?.id,
        },
      });
      if (trackedUser) {
        await this.guildCoins.save({
          ...trackedUser,
          joinTime: joinTime,
        });
      } else {
        const save = this.guildCoins.create({
          guildId: guildId,
          userId: member?.id,
          joinTime: joinTime,
          coins: 0,
          msgCount: 0,
        });
        await this.guildCoins.save(save);
      }
    } else if (oldUserChannel !== null && newUserChannel === null) {
      // User Leave a voice channel
      // Calculate with previous save time to get in voice time
      const currentTime = new Date().toISOString();
      const trackedUser = await this.guildCoins.findOne({
        where: {
          guildId: guildId,
          userId: member?.id,
        },
      });
      if (trackedUser) {
        if (!trackedUser.joinTime) {
          return;
        }
        const joinTime = new Date(trackedUser.joinTime).getTime();
        const leaveTime = new Date(currentTime).getTime();
        const diff = Math.abs(leaveTime - joinTime);
        const hoursSpent = (diff / (1000 * 60 * 60)) % 24;
        const coinsEarned = Math.floor(hoursSpent * EARN_RATE);
        console.log(trackedUser.coins, coinsEarned);
        const userCoins = Number(trackedUser.coins) + Number(coinsEarned);
        await this.guildCoins.save({
          ...trackedUser,
          coins: userCoins,
        });
      }
    }
  }
}
