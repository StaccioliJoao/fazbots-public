import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../utils/typeorm/entities/User';
import { SERVICES } from '../../utils/constants';
import { IDiscordService } from '../interfaces/discord';
import { IDiscordHttpService } from '../interfaces/discord-http';
import { InjectRepository } from '@nestjs/typeorm';
import { GuildConfiguration } from '../../utils/typeorm/entities/GuildConfiguration';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';
import { GuildUserType, PartialGuild } from 'src/utils/types';

@Injectable()
export class DiscordService implements IDiscordService {
  constructor(
    @Inject(SERVICES.DISCORD_HTTP)
    private readonly discordHttpService: IDiscordHttpService,
    @InjectRepository(GuildConfiguration)
    private readonly guildConfiguration: Repository<GuildConfiguration>,
  ) {}
  getGuildUser(guildId: string, userId: string) {
    return this.discordHttpService.fetchGuildUser(guildId, userId);
  }
  createGuildBan(
    guildId: string,
    userId: string,
    reason: string,
  ): Promise<AxiosResponse> {
    return this.discordHttpService.createGuildBan(guildId, userId, reason);
  }
  deleteGuildBan(guildId: string, userId: string): Promise<AxiosResponse> {
    return this.discordHttpService.deleteGuildBan(guildId, userId);
  }
  getGuildBans(guildId: string) {
    return this.discordHttpService.fetchGuildBans(guildId);
  }
  getBotGuilds() {
    return this.discordHttpService.fetchBotGuilds();
  }
  getUserGuilds(accessToken: string) {
    return this.discordHttpService.fetchUserGuilds(accessToken);
  }
  getUserGuildRoles(guildId: string, userId: string) {
    return this.discordHttpService.fetchUserGuildRoles(guildId, userId);
  }
  async getMutualGuilds(accessToken: string, userId: string) {
    const { data: userGuilds } = await this.getUserGuilds(accessToken);
    const dbGuilds = await this.guildConfiguration.find();
    const ownerUserGuilds: PartialGuild[] = userGuilds.filter(
      ({ owner }) => owner === true,
    );
    const mutualOwnerGuilds = ownerUserGuilds.filter((guild) =>
      dbGuilds.some((dbGuilds) => dbGuilds.guildId == guild.id),
    );
    const mutualBotUserGuilds: PartialGuild[] = [];
    userGuilds.forEach(async (guild) => {
      const userGuildRoles = await this.getUserGuildRoles(guild.id, userId);
      dbGuilds.find(function (dbGuild) {
        if (dbGuild.guildId === guild.id) {
          if (userGuildRoles.data.roles.includes(dbGuild.permSite)) {
            return mutualBotUserGuilds.push(guild);
          }
        }
      });
    });
    await new Promise((r) => setTimeout(r, 900));
    var botUserGuilds = new Set(mutualBotUserGuilds.map((guild) => guild.id));
    var merged: PartialGuild[] = [
      ...mutualBotUserGuilds,
      ...mutualOwnerGuilds.filter((guild) => !botUserGuilds.has(guild.id)),
    ];
    return merged;
  }
  getGuildChannels(guildId: string) {
    return this.discordHttpService.fetchGuildChannels(guildId);
  }
  getGuildRoles(guildId: string) {
    return this.discordHttpService.fetchGuildRoles(guildId);
  }
  getGuildEmojis(guildId: string) {
    return this.discordHttpService.fetchGuildEmojis(guildId);
  }
}
