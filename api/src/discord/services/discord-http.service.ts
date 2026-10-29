import { Injectable } from '@nestjs/common';
import { IDiscordHttpService } from '../interfaces/discord-http';
import axios, { AxiosResponse } from 'axios';
import {
  GuildBanType,
  GuildRole,
  GuildUserType,
  PartialGuild,
  PartialGuildChannel,
} from '../../utils/types';
import { DISCORD_BASE_URL } from '../../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { GuildConfiguration } from '../../utils/typeorm/entities/GuildConfiguration';
import { Repository } from 'typeorm';

@Injectable()
export class DiscordHttpService implements IDiscordHttpService {
  constructor(
    @InjectRepository(GuildConfiguration)
    private readonly guildConfiguration: Repository<GuildConfiguration>,
  ) {}
  async fetchGuildUser(guildId: string, userId: string) {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    if (botInstance) {
      const TOKEN = botInstance.botToken;
      return axios.get<GuildUserType>(
        `${DISCORD_BASE_URL}/guilds/${guildId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bot ${TOKEN}`,
          },
        },
      );
    }
  }
  async fetchUserGuildRoles(guildId: string, userId: string) {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    if (botInstance) {
      const TOKEN = botInstance.botToken;
      return axios.get<GuildUserType>(
        `${DISCORD_BASE_URL}/guilds/${guildId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bot ${TOKEN}`,
          },
        },
      );
    }
  }

  async createGuildBan(guildId: string, userId: string, reason: string) {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    const TOKEN = botInstance.botToken;
    return axios.put(
      `${DISCORD_BASE_URL}/guilds/${guildId}/bans/${userId}`,
      null,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
          'X-Audit-Log-Reason': `Ban via Painel ${reason}`,
        },
      },
    );
  }
  async deleteGuildBan(
    guildId: string,
    userId: string,
  ): Promise<AxiosResponse> {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    const TOKEN = botInstance.botToken;
    return axios.delete(
      `${DISCORD_BASE_URL}/guilds/${guildId}/bans/${userId}`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      },
    );
  }
  async fetchGuildBans(guildId: string) {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    const TOKEN = botInstance.botToken;
    return axios.get<GuildBanType[]>(
      `${DISCORD_BASE_URL}/guilds/${guildId}/bans`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      },
    );
  }

  fetchBotGuilds() {}
  fetchUserGuilds(accessToken: string) {
    return axios.get<PartialGuild[]>(`${DISCORD_BASE_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async fetchGuildChannels(
    guildId: string,
  ): Promise<AxiosResponse<PartialGuildChannel[], any>> {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    const TOKEN = botInstance.botToken;
    return axios.get<PartialGuildChannel[]>(
      `${DISCORD_BASE_URL}/guilds/${guildId}/channels`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      },
    );
  }

  async fetchGuildEmojis(guildId: string): Promise<AxiosResponse<any[]>> {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    const TOKEN = botInstance.botToken;
    return axios.get<PartialGuildChannel[]>(
      `${DISCORD_BASE_URL}/guilds/${guildId}/emojis`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      },
    );
  }
  async fetchGuildRoles(
    guildId: string,
  ): Promise<AxiosResponse<GuildRole[], any>> {
    const botInstance = await this.guildConfiguration.findOne({ guildId });
    const TOKEN = botInstance.botToken;
    return axios.get<GuildRole[]>(
      `${DISCORD_BASE_URL}/guilds/${guildId}/roles`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      },
    );
  }
}
