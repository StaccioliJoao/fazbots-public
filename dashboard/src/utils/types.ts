export type User = {
  discordId: string;
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

export type GuildConfigType = {
  id: number;
  guildId: string;
  botId: string;
  prefix: string;
  welcomeChannelId: string;
  welcomeChannelMessage: string;
  migrarChannelId: string;
  migrarChannelText: string;
  migrarChannelImg: string;
  migrarRoles: string[];
  registerChannelId: string;
  randomgifsChannelId: string;
  randomiconsChannelId: string;
  voicecountChannelId: string;
  banLogChannelId: string;
  kickLogChannelId: string;
  muteLogChannelId: string;
  entryLogChannelId: string;
  instagramChannelId: string;
  banPermRoles: string[];
  mutePermRoles: string[];
  kickPermRoles: string[];
  pdRole: string;
  pdPerms: PdPerm[];
  ownerId: string;
  permSite: string;
  muteRole: string;
  voiceCountMsg: string;
  memberCountId: string;
  memberCountMsg: string;
  memberCountEmojis: string[];
  migrarColor: string;
  registerChannelText: string;
  registerChannelImg: string;
  registerColor: string;
  registerMale: string;
  registerFemale: string;
  registerOver: string;
  registerUnder: string;
  activeMemberRole: string[];
  activeMemberPerms: string[];
  activeMemberMsg: string;
  activeMemberToggle: boolean;
  activeMemberGoal: number;
  verifiedLogChannel: string;
  verifierRole: string;
  verifiedRole: string;
  tellonymPostChannel: string;
  tellonymCreateChannel: string;
  tellonymVoteChannel: string;
  tellonymRoles: string[];
  tellonymText: string;
  tellonymImg: string;
  tellonymLimit: number;
  tellonymColors: string;
  sejaMembroChannel: string;
  sejaMembroText: string;
  sejaMembroImg: string;
  sejaMembroColor: string;
  sejaMembroRoles: string[];
  sejaMembroVerify: string[];
  deafToggle: boolean;
  muteToggle: boolean;
  hourCounterRoles: string[];
  hourCounterPerms: string[];
  counterCategories: string[];
  likeEmoji: string;
  commentEmoji: string;
  viewLikeEmoji: string;
  viewCommentEmoji: string;
  influencerPerm: string[];
  influencerRole: string;
  influencerPainel: string;
  influencerInstaChannel: string;
};
export type emojiOptions = {
  value: string;
  label: JSX.Element;
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

export type userPd = {
  guildId: string;
  userId: string;
  pdList: PdUser[];
};

export type PdUser = {
  userId: string;
  userName: string;
  avatar?: string;
  since: number;
};

export type ActiveMember = {
  userId: string;
  username: string;
  avatar?: string;
};

export type VerifiedMember = {
  userId: string;
  userName: string;
  userAvatar?: string;
  verifierId: string;
  verifierName: string;
};
