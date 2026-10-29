import axios, { AxiosRequestConfig } from "axios";
import {
  ActiveMember,
  DiscordUserType,
  GuildBanType,
  GuildConfigType,
  GuildUserType,
  PartialGuild,
  PdPerm,
  PdUser,
  User,
  userPd,
  VerifiedMember,
} from "./types";

const CONFIG: AxiosRequestConfig = { withCredentials: true };
export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";
export const getAuthStatus = () =>
  axios.get<User>(`${API_URL}/auth/status`, CONFIG);

export const getMutualGuilds = () =>
  axios.get<PartialGuild[]>(`${API_URL}/discord/guilds`, CONFIG);

export const getGuildConfig = (guildId: string) =>
  axios.get<GuildConfigType>(`${API_URL}/guilds/config/${guildId}`, CONFIG);

export const getGuildTextChannels = (guildId: string) =>
  axios.get(`${API_URL}/discord/guilds/${guildId}/channels`, CONFIG);

export const updateInfluencer = (
  guildId: string,
  influencerPainel: string | undefined,
  influencerPerm: any[],
  influencerRole: string | undefined,
  influencerInstagram: string | undefined
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/influencer`,
    {
      influencerPainel,
      influencerPerm,
      influencerRole,
      influencerInstagram,
    },
    CONFIG
  );
};

export const getAllGuildChannels = (guildId: string) =>
  axios.get(`${API_URL}/discord/guilds/${guildId}/channels/all`, CONFIG);

export const getGuildRoles = (guildId: string) =>
  axios.get(`${API_URL}/discord/guilds/${guildId}/roles`, CONFIG);

export const getGuildBans = (guildId: string) =>
  axios.get<GuildBanType[]>(
    `${API_URL}/discord/guilds/${guildId}/bans`,
    CONFIG
  );

export const getGuildEmojis = (guildId: string) =>
  axios.get<any[]>(`${API_URL}/discord/guilds/${guildId}/emojis`, CONFIG);

export const getDiscordUser = (guildId: string, userId: string) =>
  axios.get<GuildUserType>(
    `${API_URL}/discord/guilds/${guildId}/users/${userId}`,
    CONFIG
  );

export const getGuildPds = (guildId: string) =>
  axios.get<userPd[]>(`${API_URL}/guilds/${guildId}/pds`, CONFIG);

export const getGuildActiveMembers = (guildId: string) =>
  axios.get<ActiveMember[]>(
    `${API_URL}/guilds/${guildId}/membrosativos`,
    CONFIG
  );

export const getGuildVerifiedMembers = (guildId: string) =>
  axios.get<VerifiedMember[]>(
    `${API_URL}/guilds/${guildId}/membrosverificados`,
    CONFIG
  );

export const removeGuildPd = (guildId: string, userId: string, PDs: PdUser) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/pds/remove/${userId}`,
    {
      PDs,
    },
    CONFIG
  );

export const removeGuildActiveMember = (guildId: string, userId: string) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/membrosativos/remove/${userId}`,
    {},
    CONFIG
  );

export const removeGuildVerifiedMember = (guildId: string, userId: string) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/membrosverificados/remove/${userId}`,
    {},
    CONFIG
  );

export const resetGuildPds = (guildId: string) =>
  axios.delete(`${API_URL}/guilds/${guildId}/pds/reset`, CONFIG);

export const resetGuildActiveMembers = (guildId: string) =>
  axios.delete(`${API_URL}/guilds/${guildId}/membrosativos/reset`, CONFIG);

export const resetGuildVerifiedMembers = (guildId: string) =>
  axios.delete(`${API_URL}/guilds/${guildId}/membrosverificados/reset`, CONFIG);

export const updateWelcomeChannelId = (
  guildId: string,
  channelId: string,
  welcomeChannelMessage: string
) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/welcome`,
    {
      channelId,
      welcomeChannelMessage,
    },
    CONFIG
  );

export const updateHourCounter = (
  guildId: string,
  deafToggle: boolean,
  muteToggle: boolean,
  rolesToCount: string[],
  counterPerms: string[],
  counterCategories: string[]
) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/hourcounter`,
    {
      deafToggle,
      muteToggle,
      rolesToCount,
      counterPerms,
      counterCategories,
    },
    CONFIG
  );

export const updateVerifiedConfig = (
  guildId: string,
  verifiedLogChannelId: string,
  verifierRole: string,
  verifiedRole: string
) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/verification`,
    {
      verifiedLogChannelId,
      verifierRole,
      verifiedRole,
    },
    CONFIG
  );

export const updateVoiceCounter = (
  guildId: string,
  channelId: string,
  voiceCountMsg: string
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/voicecount`,
    {
      channelId,
      voiceCountMsg,
    },
    CONFIG
  );
};

export const updateMemberCounter = (
  guildId: string,
  channelId: string,
  counterEmojis: string[],
  counterMsg: string
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/membercount`,
    {
      channelId,
      counterEmojis,
      counterMsg,
    },
    CONFIG
  );
};

export const updateMigrarConfig = (
  guildId: string,
  channelId: string,
  migrarRoles: string[],
  migrarChannelMsg: string,
  migrarChannelImg: string,
  migrarColor: string
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/migrar`,
    {
      channelId,
      migrarRoles,
      migrarChannelMsg,
      migrarChannelImg,
      migrarColor,
    },
    CONFIG
  );
};

export const updateSejaMembroConfig = (
  guildId: string,
  channelId: string,
  sejaMembroMsg: string,
  sejaMembroImg: string,
  sejaMembroColor: string,
  sejaMembroRoles: string[],
  sejaMembroVerify: string[]
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/sejamembro`,
    {
      channelId,
      sejaMembroRoles,
      sejaMembroMsg,
      sejaMembroImg,
      sejaMembroColor,
      sejaMembroVerify,
    },
    CONFIG
  );
};

export const updateRegisterConfig = (
  guildId: string,
  channelId: string,
  registerChannelMsg: string | undefined,
  registerChannelImg: string | undefined,
  maleRole: string | undefined,
  femaleRole: string | undefined,
  underRole: string | undefined,
  overRole: string | undefined,
  registerColor: string | undefined
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/register`,
    {
      channelId,
      registerChannelMsg,
      registerChannelImg,
      maleRole,
      femaleRole,
      underRole,
      overRole,
      registerColor,
    },
    CONFIG
  );
};

export const updateTellonymConfig = (
  guildId: string,
  postChannel: string | undefined,
  createChannel: string | undefined,
  voteChannel: string | undefined,
  embedMsg: string | undefined,
  embedImg: string | undefined,
  tellonymRoles: string[],
  tellonymColors: string | undefined,
  tellonymLimit: number | undefined
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/tellonym`,
    {
      postChannel,
      createChannel,
      voteChannel,
      embedMsg,
      embedImg,
      tellonymRoles,
      tellonymColors,
      tellonymLimit,
    },
    CONFIG
  );
};

export const updateActiveMember = (
  guildId: string,
  activeMemberMessage: string,
  activeMemberGoal: number,
  activeMemberPerms: string[],
  activeMemberRoles: string[],
  activeMemberToggle: boolean
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/activemember`,
    {
      activeMemberMessage,
      activeMemberGoal,
      activeMemberPerms,
      activeMemberRoles,
      activeMemberToggle,
    },
    CONFIG
  );
};

export const updateGuildPermissions = (
  guildId: string,
  banPerms: any[] | undefined,
  kickPerms: any[] | undefined,
  mutePerms: any[] | undefined,
  permSite: string | undefined,
  muteRole: string | undefined
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/permissions`,
    {
      banRoles: banPerms,
      kickRoles: kickPerms,
      muteRoles: mutePerms,
      permSite: permSite,
      muteRole: muteRole,
    },
    CONFIG
  );
};

export const updatePdPermissions = (
  guildId: string,
  pdRole: string | undefined,
  pdPerms: PdPerm[]
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/pd`,
    {
      pdRole,
      pdPerms,
    },
    CONFIG
  );
};

export const updateInstaChannelId = (
  guildId: string,
  channelId: string | undefined,
  likeEmoji: string | undefined,
  commentEmoji: string | undefined,
  viewCommentEmoji: string | undefined,
  viewLikeEmoji: string | undefined
) => {
  axios.post(
    `${API_URL}/guilds/${guildId}/config/instagram`,
    {
      channelId,
      likeEmoji,
      commentEmoji,
      viewCommentEmoji,
      viewLikeEmoji,
    },
    CONFIG
  );
};

export const updateGuildPrefix = (guildId: string, prefix: string) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/prefix`,
    {
      prefix,
    },
    CONFIG
  );

export const updateLogsChannel = (
  guildId: string,
  banLogChannelId: string | undefined,
  kickLogChannelId: string | undefined,
  muteLogChannelId: string | undefined,
  entryLogChannelId: string | undefined
) =>
  axios.post(
    `${API_URL}/guilds/${guildId}/config/logs`,
    {
      banLogChannelId,
      kickLogChannelId,
      muteLogChannelId,
      entryLogChannelId,
    },
    CONFIG
  );

export const deleteGuildBan = (guildId: string, userId: string) => {
  axios.delete(`${API_URL}/discord/guilds/${guildId}/bans/${userId}`, CONFIG);
};

export const createGuildBan = (
  guildId: string,
  userId: string,
  reason: string
) =>
  axios.put(
    `${API_URL}/discord/guilds/${guildId}/bans/${userId}`,
    {
      reason,
    },
    CONFIG
  );
