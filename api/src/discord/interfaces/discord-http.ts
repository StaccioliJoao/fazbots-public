import { AxiosResponse } from 'axios';
import {
  GuildBanType,
  GuildRole,
  GuildUserType,
  PartialGuild,
  PartialGuildChannel,
} from '../../utils/types';

export interface IDiscordHttpService {
  fetchBotGuilds();
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
  fetchGuildChannels(
    guildId: string,
  ): Promise<AxiosResponse<PartialGuildChannel[]>>;
  fetchGuildBans(guildId: string): Promise<AxiosResponse<GuildBanType[]>>;
  deleteGuildBan(guildId: string, userId: string): Promise<AxiosResponse>;
  createGuildBan(guildId: string, userId: string, reason: string);
  fetchGuildRoles(guildId: string): Promise<AxiosResponse<GuildRole[]>>;
  fetchUserGuildRoles(
    guildId: string,
    userId: string,
  ): Promise<AxiosResponse<GuildUserType>>;
  fetchGuildUser(
    guildId: string,
    userId: string,
  ): Promise<AxiosResponse<GuildUserType>>;
  fetchGuildEmojis(guildId: string): Promise<AxiosResponse<any[]>>;
}
