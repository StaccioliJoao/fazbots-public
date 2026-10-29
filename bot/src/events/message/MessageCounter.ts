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

export default class MessageEvent extends BaseEvent {
  constructor(
    private readonly messageCounterRepository = AppDataSource.getRepository(
      GuildMessageCounter
    )
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

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    const config = client.configs.get(message.guildId!);
    if (!config) {
      return;
    }
    const userTrack = await this.messageCounterRepository.findOne({
      where: {
        guildId: message.guild?.id,
        userId: message.author.id,
      },
    });
    const countRoles = config.hourCounterRoles;
    if (!countRoles) return;
    if (userTrack && message.member?.roles.cache.hasAny(...countRoles)) {
      //get the week by using moment js
      const brasiliaTimezone = "America/Sao_Paulo";
      const today = new Date();
      const week = moment(today).tz(brasiliaTimezone).week();
      //get the week from the userTrack and increment the message count
      const highestRole = this.getHighestRole(message.member!, countRoles);
      const weekIndex = userTrack.week.findIndex((w) => w.week === week);
      if (weekIndex === -1) {
        const newWeek = {
          week: week,
          message_count: 1,
        };
        userTrack.week.push(newWeek);
        userTrack.roleId = highestRole!.id;
        await this.messageCounterRepository.save(userTrack);
      } else {
        userTrack.week[weekIndex].message_count++;
        const highestRole = this.getHighestRole(message.member!, countRoles);
        userTrack.roleId = highestRole!.id;
        await this.messageCounterRepository.save(userTrack);
      }
    } else if (message.member?.roles.cache.hasAny(...countRoles)) {
      const today = new Date();
      const week = moment(today).week();
      const newWeek = {
        week: week,
        message_count: 1,
      };
      const highestRole = this.getHighestRole(message.member!, countRoles);
      const newTrack = this.messageCounterRepository.create({
        guildId: message.guild?.id,
        userId: message.author.id,
        week: [newWeek],
        roleId: highestRole!.id,
      });
      await this.messageCounterRepository.save(newTrack);
    }
  }
}
