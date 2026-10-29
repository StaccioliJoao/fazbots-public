import {
  ActiveMember,
  PdPerm,
  PdUser,
  userPd,
  VerifiedMember,
} from '../../utils/types';
import { GuildConfiguration } from '../../utils/typeorm/entities/GuildConfiguration';
import { AxiosResponse } from 'axios';

export interface IGuildsService {
  getGuildConfig(guildId: string): Promise<GuildConfiguration>;
  updateGuildPrefix(
    guildId: string,
    prefix: string,
  ): Promise<GuildConfiguration>;
  updateWelcomeChannel(
    guildId: string,
    welcomeChannelId: string,
    welcomeChannelMessage: string,
  ): Promise<GuildConfiguration>;
  updateVoiceCounter(
    guildId: string,
    voiceCountChannelId: string,
    voiceCountMsg: string,
  ): Promise<GuildConfiguration>;
  updateGuildLogs(
    guildId: string,
    banLogChannelId: string | undefined,
    kickLogChannelId: string | undefined,
    muteLogChannelId: string | undefined,
    entryLogChannelId: string | undefined,
  ): Promise<GuildConfiguration>;
  updateInstagramChannel(
    guildId: string,
    instagramChannelId: string,
    likeEmoji: string | undefined,
    commentEmoji: string | undefined,
    viewCommentEmoji: string | undefined,
    viewLikeEmoji: string | undefined,
  ): Promise<GuildConfiguration>;
  updateGuildPermissions(
    guildId: string,
    banRoles: any[] | undefined,
    kickRoles: any[] | undefined,
    muteRoles: any[] | undefined,
    permSite: any,
    muteRole: any,
  ): Promise<GuildConfiguration>;
  updateGuildPd(
    guildId: string,
    pdRole: string | undefined,
    pdPerms: PdPerm[],
  ): Promise<GuildConfiguration>;
  updateGuildVerification(
    guildId: string,
    verifiedLogChannelId: string,
    verifierRole: string,
    verifiedRole: string,
  ): Promise<GuildConfiguration>;

  getGuildPds(guildId: string): Promise<userPd[]>;
  getGuildMembrosAtivos(guildId: string): Promise<ActiveMember[]>;
  getGuildMembrosVerificados(guildId: string): Promise<VerifiedMember[]>;
  removeGuildPd(guildId: string, userId: string, PDs: PdUser);
  removeGuildActiveMember(guildId: string, userId: string);
  removeGuildVerifiedMember(guildId: string, userId: string);
  resetGuildPds(guildId: string);
  resetGuildActiveMembers(guildId: string);
  resetGuildVerifiedMembers(guildId: string);

  updateMemberCounter(
    guildId: string,
    channelId: string,
    counterEmojis: string[],
    counterMsg: string,
  );

  updateMigrarConfig(
    guildId: string,
    channelId: string,
    migrarRoles: string[],
    migrarChannelMsg: string,
    migrarChannelImg: string,
    migrarColor: string,
  ): Promise<GuildConfiguration>;

  updateSejaMembroConfig(
    guildId: string,
    channelId: string,
    sejaMembroMsg: string,
    sejaMembroImg: string,
    sejaMembroColor: string,
    sejaMembroRoles: string[],
    sejaMembroVerify: string[],
  ): Promise<GuildConfiguration>;

  updateTellonymConfig(
    guildId: string,
    postChannel: string | undefined,
    createChannel: string | undefined,
    voteChannel: string | undefined,
    embedMsg: string | undefined,
    embedImg: string | undefined,
    tellonymRoles: string[],
    tellonymColors: string | undefined,
    tellonymLimit: number | undefined,
  ): Promise<GuildConfiguration>;
  updateRegisterConfig(
    guildId: string,
    channelId: string,
    registerChannelMsg: string | undefined,
    registerChannelImg: string | undefined,
    maleRole: string | undefined,
    femaleRole: string | undefined,
    underRole: string | undefined,
    overRole: string | undefined,
    registerColor: string | undefined,
  ): Promise<GuildConfiguration>;

  updateActiveMemberConfig(
    guildId: string,
    activeMemberMessage: string,
    activeMemberGoal: number,
    activeMemberPerms: string[],
    activeMemberRoles: string[],
    activeMemberToggle: boolean,
  ): Promise<GuildConfiguration>;

  updateHourCounter(
    guildId: string,
    deafToggle: boolean,
    muteToggle: boolean,
    rolesToCount: string[],
    counterPerms: string[],
    counterCategories: string[],
  ): Promise<GuildConfiguration>;
  updateInfluencerConfig(
    guildId: string,
    influencerPainel: string | undefined,
    influencerPerm: any[],
    influencerRole: string | undefined,
    influencerInstagram: string | undefined,
  ): Promise<GuildConfiguration>;
}
