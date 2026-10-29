import { User } from './typeorm/entities/User';

export type UserDetails = {
  discordId: string;
  accessToken: string;
  refreshToken: string;
  username: string;
  discriminator: string;
  avatar?: string;
};

export type userPd = {
  guildId: string;
  userId: string;
  pdList: PdUser[];
};

export type ActiveMember = {
  userId: string;
  userName: string;
  avatar?: string;
};

export type ActiveMemberDb = {
  guildId: string;
  userId: string;
  msgCount: number;
  status: string;
  userName: string;
  avatar?: string;
};

export type VerifiedMemberDb = {
  guildId: string;
  userId: string;
  verifierId: string;
  verifierName: string;
  avatar?: string;
  username: string;
};
export type PdUser = {
  userId: string;
  userName: string;
  avatar?: string;
  since: Date;
};

export type UpdateUserDetails = {
  accessToken: string;
  refreshToken: string;
  username: string;
  discriminator: string;
  avatar?: string;
};

export type PartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
};

export type PartialGuildChannel = {
  id: string;
  last_message_id: string;
  type: number;
  name: string;
  position: number;
  parent_id?: string;
  topic?: string;
  guild_id: string;
  permission_overwrites: string[];
  nsfw: boolean;
  rate_limit_per_user: string;
  banner?: string;
};

export type ModerationActionType = 'ban' | 'kick' | 'timeout';

export type DiscordUserType = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
};

export type GuildUserType = {
  user?: DiscordUserType;
  nick?: string;
  avatar?: string;
  roles: string[];
  deaf: boolean;
  mute: boolean;
  pending: boolean;
  permissions?: string;
};

export type GuildBanType = {
  reason?: string;
  user: DiscordUserType;
};

export type RoleTags = {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber?: any;
};

export type GuildRole = {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string;
  unicode_emoji?: string;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTags;
};

export type PdPerm = {
  id: string;
  limit: number;
};

export type VerifiedMember = {
  userId: string;
  username: string;
  avatar?: string;
  verifierId: string;
  verifierName: string;
};

export type Done = (err: Error, user: User) => void;
