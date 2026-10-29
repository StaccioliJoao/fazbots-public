// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
import { GuildMember, Role, VoiceState } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildHourCounter } from "../typeorm/entities/GuildHourCounter";
import moment from "moment-timezone";

let startTime: moment.Moment;

export default class WoiceStateUpdateEvent extends BaseEvent {
  constructor(
    private readonly guildsHourCounter = AppDataSource.getRepository(
      GuildHourCounter
    )
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
    const vip_categories = [
      "1077285737763966996",
      "1075283741368397824",
      "1075283742341476372",
      "1077285859696586752",
      "1075283743482335302",
    ];
    if (!config?.hourCounterRoles && !config?.counterCategories) {
      return;
    }
    //check if the user has a counter role
    if (!member?.roles.cache.hasAny(...config!.hourCounterRoles)) {
      return;
    }
    if (!oldState.channel && newState.channel) {
      // User Joins a voice channel
      const now = moment().tz("America/Sao_Paulo");
      const isAfter23h = now.isAfter(
        now.clone().startOf("day").add(23, "hours")
      );
      if (
        (config?.counterCategories.includes(newState.channel.parentId!) &&
          member?.roles.cache.hasAny(...config!.hourCounterRoles)) ||
        (vip_categories.includes(newState.channel.parentId!) &&
          isAfter23h &&
          member?.roles.cache.hasAny(...config!.hourCounterRoles))
      ) {
        startTime = moment().tz("America/Sao_Paulo");
      }
    }
    if (oldState.channel && !newState.channel) {
      // User leaves a voice channel
      if (!startTime) return;
      if (
        !config?.counterCategories.includes(oldState.channel.parentId!) ||
        !member?.roles.cache.hasAny(...config!.hourCounterRoles)
      ) {
        //not in a counter category before leaving or not having a counter role
        return;
      }
      if (
        vip_categories.includes(oldState.channel.parentId!) &&
        member.roles.cache.hasAny(...config!.hourCounterRoles)
      ) {
        const now = moment().tz("America/Sao_Paulo");
        const isBefore12h = now.isBefore(
          moment(startTime)
            .clone()
            .add(1, "day")
            .startOf("day")
            .add(12, "hours")
        );
        //check if user joined vip channel before 23h
        const isAfter23h = startTime.isAfter(
          startTime.clone().startOf("day").add(23, "hours")
        );
        if (isBefore12h && isAfter23h) {
          const endTime = moment().tz("America/Sao_Paulo");
          const duration = moment.duration(endTime.diff(startTime));
          console.log(
            `User ${
              member?.displayName
            } spent ${duration.asSeconds()} seconds in the voice channel - VIP BEFORE 12h and AFTER 23h`
          );
        } else if (!isBefore12h && isAfter23h) {
          //count time up to 12h
          const endTime = now.clone().startOf("day").add(12, "hours");
          const duration = moment.duration(endTime.diff(startTime));
          console.log(
            `User ${
              member?.displayName
            } spent ${duration.asSeconds()} seconds in the voice channel - VIP AFTER 12h and AFTER 23h`
          );
        }
      }
      const endTime = moment().tz("America/Sao_Paulo");
      const duration = moment.duration(endTime.diff(startTime));
      console.log(
        `User ${
          member?.displayName
        } spent ${duration.asSeconds()} seconds in the voice channel`
      );
    }
    if (oldState.channel && newState.channel) {
      // User switches voice channels
      if (
        config?.counterCategories.includes(oldUserChannel!.parent!.id) &&
        config?.counterCategories.includes(newUserChannel!.parent!.id)
      ) {
        //saiu de canal q conta pra q conta okay!
      }
      if (
        config?.counterCategories.includes(oldUserChannel!.parent!.id) &&
        !config?.counterCategories.includes(newUserChannel!.parent!.id)
      ) {
        //saiu de canal q conta pra q n conta
        //check if the channel is a vip channel and the hour is between 23h and 12h
        const now = moment().tz("America/Sao_Paulo");
        const isAfter23h = now.isAfter(
          now.clone().startOf("day").add(23, "hours")
        );
        if (vip_categories.includes(oldUserChannel!.parent!.id) && isAfter23h) {
          //keep counting
        }
        const endTime = moment().tz("America/Sao_Paulo");
        const duration = moment.duration(endTime.diff(startTime));
        console.log(
          `User ${
            member?.displayName
          } spent ${duration.asSeconds()} seconds in the voice channel`
        );
      }
    }
  }
}
