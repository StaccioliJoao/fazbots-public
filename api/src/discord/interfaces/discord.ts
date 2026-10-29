import { AxiosResponse } from 'axios';
import {
  GuildBanType,
  GuildRole,
  PartialGuildChannel,
} from '../../utils/types';

export interface IDiscordService {
  getBotGuilds();
  getUserGuilds(accessToken: string);
  getMutualGuilds(accessToken: string, userId: string);
  getGuildChannels(
    guildId: string,
  ): Promise<AxiosResponse<PartialGuildChannel[]>>;
  getGuildRoles(guildId: string): Promise<AxiosResponse<GuildRole[]>>;
  getGuildBans(guildId: string): Promise<AxiosResponse<GuildBanType[]>>;
  deleteGuildBan(guildId: string, userId: string): Promise<AxiosResponse>;
  createGuildBan(
    guildId: string,
    userId: string,
    reason: String,
  ): Promise<AxiosResponse>;
  getGuildUser(guildId: string, userId: string);
  getGuildEmojis(guildId: string);
}
