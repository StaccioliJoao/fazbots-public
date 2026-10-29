import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/utils/Guards';
import { ROUTES, SERVICES } from '../../utils/constants';
import { IGuildsService } from '../interfaces/guilds';
import { WebsocketHandler } from '../../websocket/socket';
import { PdPerm, PdUser } from '../../utils/types';
import { RolePermissionGuard } from 'src/rolepermission/utils/RolePermissionGuard';
@Controller(ROUTES.GUILDS)
export class GuildsController {
  constructor(
    @Inject(SERVICES.GUILDS) private readonly guildServices: IGuildsService,
    @Inject(WebsocketHandler) private readonly wsHandler: WebsocketHandler,
    @Inject(RolePermissionGuard) private roleGuard: RolePermissionGuard,
  ) {}
  @Get('config/:guildId')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildConfig(@Param('guildId') guildId: string) {
    const guildConfig = await this.guildServices.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Guild Configuration was not found',
        HttpStatus.NOT_FOUND,
      );
    return guildConfig;
  }

  @Get(':guildId/pds')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildPds(@Param('guildId') guildId: string) {
    const guildPds = await this.guildServices.getGuildPds(guildId);
    if (!guildPds)
      throw new HttpException('Guild PDs was not found', HttpStatus.NOT_FOUND);
    return guildPds;
  }

  @Get(':guildId/membrosativos')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildMembrosAtivos(@Param('guildId') guildId: string) {
    const guildMembrosAtivos = await this.guildServices.getGuildMembrosAtivos(
      guildId,
    );
    if (!guildMembrosAtivos) {
      throw new HttpException(
        'Guild Membros Ativos was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return guildMembrosAtivos;
  }

  @Get(':guildId/membrosverificados')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildMembrosVerificados(@Param('guildId') guildId: string) {
    const guildMembrosVerificados =
      await this.guildServices.getGuildMembrosVerificados(guildId);
    if (!guildMembrosVerificados) {
      throw new HttpException(
        'Guild Membros Verificados was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return guildMembrosVerificados;
  }

  @Post(':guildId/pds/remove/:userId')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async removeGuildPd(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
    @Body('PDs') PDs: PdUser,
  ) {
    const userPDs = await this.guildServices.removeGuildPd(
      guildId,
      userId,
      PDs,
    );
    this.wsHandler.guildRemovePd(guildId, PDs.userId);
    return userPDs;
  }

  @Post(':guildId/membrosativos/remove/:userId')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async removeActiveMember(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ) {
    const activeMembers = await this.guildServices.removeGuildActiveMember(
      guildId,
      userId,
    );
    this.wsHandler.guildRemoveActiveMember(guildId, userId);
    return activeMembers;
  }

  @Post(':guildId/membrosverificados/remove/:userId')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async removeVerifiedMember(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ) {
    const verifiedMembers = await this.guildServices.removeGuildVerifiedMember(
      guildId,
      userId,
    );
    this.wsHandler.guildRemoveVerifiedMember(guildId, userId);
    return verifiedMembers;
  }

  @Post(':guildId/config/prefix')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateGuildPrefix(
    @Param('guildId') guildId: string,
    @Body('prefix') prefix: string,
  ) {
    const config = await this.guildServices.updateGuildPrefix(guildId, prefix);
    this.wsHandler.guildPrefixUpdate(config);
    return config;
  }
  @Post(':guildId/config/verification')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateGuildVerification(
    @Param('guildId') guildId: string,
    @Body('verifiedLogChannelId') verifiedLogChannelId: string,
    @Body('verifierRole') verifierRole: string,
    @Body('verifiedRole') verifiedRole: string,
  ) {
    const config = await this.guildServices.updateGuildVerification(
      guildId,
      verifiedLogChannelId,
      verifierRole,
      verifiedRole,
    );
    this.wsHandler.guildVerificationUpdate(config);
    return config;
  }

  @Delete(':guildId/pds/reset')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async resetGuildPds(@Param('guildId') guildId: string) {
    await this.guildServices.resetGuildPds(guildId);
  }

  @Delete(':guildId/membrosativos/reset')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async resetGuildActiveMembers(@Param('guildId') guildId: string) {
    await this.guildServices.resetGuildActiveMembers(guildId);
  }

  @Delete(':guildId/membrosverificados/reset')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async resetGuildVerifiedMembers(@Param('guildId') guildId: string) {
    await this.guildServices.resetGuildVerifiedMembers(guildId);
  }

  @Post(':guildId/config/pd')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateGuildPd(
    @Param('guildId') guildId: string,
    @Body('pdRole') pdRole: string,
    @Body('pdPerms') pdPerms: PdPerm[],
  ) {
    const config = await this.guildServices.updateGuildPd(
      guildId,
      pdRole,
      pdPerms,
    );
    this.wsHandler.guildPdUpdate(config);
    return config;
  }

  @Post(':guildId/config/instagram')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateInstagramChannel(
    @Param('guildId') guildId: string,
    @Body('channelId') instagramChannelId: string,
    @Body('likeEmoji') likeEmoji: string,
    @Body('commentEmoji') commentEmoji: string,
    @Body('viewCommentEmoji') viewCommentEmoji: string,
    @Body('viewLikeEmoji') viewLikeEmoji: string,
  ) {
    const config = await this.guildServices.updateInstagramChannel(
      guildId,
      instagramChannelId,
      likeEmoji,
      commentEmoji,
      viewCommentEmoji,
      viewLikeEmoji,
    );
    this.wsHandler.guildInstagramUpdate(config);
    return config;
  }

  @Post(':guildId/config/welcome')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateWelcomeChannel(
    @Param('guildId') guildId: string,
    @Body('channelId') welcomeChannelId: string,
    @Body('welcomeChannelMessage') welcomeChannelMessage: string,
  ) {
    const config = await this.guildServices.updateWelcomeChannel(
      guildId,
      welcomeChannelId,
      welcomeChannelMessage,
    );
    this.wsHandler.guildWelcomeUpdate(config);
    return config;
  }

  @Post(':guildId/config/hourcounter')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateHourCounter(
    @Param('guildId') guildId: string,
    @Body('deafToggle') deafToggle: boolean,
    @Body('muteToggle') muteToggle: boolean,
    @Body('rolesToCount') rolesToCount: string[],
    @Body('counterPerms') counterPerms: string[],
    @Body('counterCategories') counterCategories: string[],
  ) {
    const config = await this.guildServices.updateHourCounter(
      guildId,
      deafToggle,
      muteToggle,
      rolesToCount,
      counterPerms,
      counterCategories,
    );
    this.wsHandler.updateHourCounter(config);
    return config;
  }

  @Post(':guildId/config/voicecount')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateVoiceCounter(
    @Param('guildId') guildId: string,
    @Body('channelId') welcomeChannelId: string,
    @Body('voiceCountMsg') voiceCountMsg: string,
  ) {
    const config = await this.guildServices.updateVoiceCounter(
      guildId,
      welcomeChannelId,
      voiceCountMsg,
    );
    this.wsHandler.guildWelcomeUpdate(config);
    return config;
  }

  @Post(':guildId/config/tellonym')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateTellonymConfig(
    @Param('guildId') guildId: string,
    @Body('postChannel') postChannel: string,
    @Body('createChannel') createChannel: string,
    @Body('voteChannel') voteChannel: string,
    @Body('embedMsg') embedMsg: string,
    @Body('embedImg') embedImg: string,
    @Body('tellonymRoles') tellonymRoles: string[],
    @Body('tellonymColors') tellonymColors: string,
    @Body('tellonymLimit') tellonymLimit: number,
  ) {
    const config = await this.guildServices.updateTellonymConfig(
      guildId,
      postChannel,
      createChannel,
      voteChannel,
      embedMsg,
      embedImg,
      tellonymRoles,
      tellonymColors,
      tellonymLimit,
    );
    this.wsHandler.guildUpdateTellonym(config);
    return config;
  }

  @Post(':guildId/config/membercount')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateMemberCounter(
    @Param('guildId') guildId: string,
    @Body('channelId') channelId: string,
    @Body('counterEmojis') counterEmojis: string[],
    @Body('counterMsg') counterMsg: string,
  ) {
    const config = await this.guildServices.updateMemberCounter(
      guildId,
      channelId,
      counterEmojis,
      counterMsg,
    );
    this.wsHandler.guildWelcomeUpdate(config);
    return config;
  }

  @Post(':guildId/config/migrar')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateMigrarConfig(
    @Param('guildId') guildId: string,
    @Body('channelId') channelId: string,
    @Body('migrarRoles') migrarRoles: string[],
    @Body('migrarChannelMsg') migrarChannelMsg: string,
    @Body('migrarChannelImg') migrarChannelImg: string,
    @Body('migrarColor') migrarColor: string,
  ) {
    const config = await this.guildServices.updateMigrarConfig(
      guildId,
      channelId,
      migrarRoles,
      migrarChannelMsg,
      migrarChannelImg,
      migrarColor,
    );
    this.wsHandler.guildMigrarUpdate(config);
    return config;
  }

  @Post(':guildId/config/sejamembro')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateSejaMembroConfig(
    @Param('guildId') guildId: string,
    @Body('channelId') channelId: string,
    @Body('sejaMembroMsg') sejaMembroMsg: string,
    @Body('sejaMembroImg') sejaMembroImg: string,
    @Body('sejaMembroColor') sejaMembroColor: string,
    @Body('sejaMembroRoles') sejaMembroRoles: string[],
    @Body('sejaMembroVerify') sejaMembroVerify: string[],
  ) {
    const config = await this.guildServices.updateSejaMembroConfig(
      guildId,
      channelId,
      sejaMembroMsg,
      sejaMembroImg,
      sejaMembroColor,
      sejaMembroRoles,
      sejaMembroVerify,
    );
    this.wsHandler.guildSejaMembroUpdate(config);
    return config;
  }

  @Post(':guildId/config/register')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateRegisterConfig(
    @Param('guildId') guildId: string,
    @Body('channelId') channelId: string,
    @Body('registerChannelMsg') registerChannelMsg: string,
    @Body('registerChannelImg') registerChannelImg: string,
    @Body('maleRole') maleRole: string,
    @Body('femaleRole') femaleRole: string,
    @Body('underRole') underRole: string,
    @Body('overRole') overRole: string,
    @Body('registerColor') registerColor: string,
  ) {
    const config = await this.guildServices.updateRegisterConfig(
      guildId,
      channelId,
      registerChannelMsg,
      registerChannelImg,
      maleRole,
      femaleRole,
      underRole,
      overRole,
      registerColor,
    );
    this.wsHandler.guildRegisterUpdate(config);
    return config;
  }

  @Post(':guildId/config/activemember')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateActiveMemberConfig(
    @Param('guildId') guildId: string,
    @Body('activeMemberMessage') activeMemberMessage: string,
    @Body('activeMemberGoal') activeMemberGoal: number,
    @Body('activeMemberPerms') activeMemberPerms: string[],
    @Body('activeMemberRoles') activeMemberRoles: string[],
    @Body('activeMemberToggle') activeMemberToggle: boolean,
  ) {
    const config = await this.guildServices.updateActiveMemberConfig(
      guildId,
      activeMemberMessage,
      activeMemberGoal,
      activeMemberPerms,
      activeMemberRoles,
      activeMemberToggle,
    );
    this.wsHandler.guildWelcomeUpdate(config);
    return config;
  }

  @Post(':guildId/config/permissions')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateGuildPermissions(
    @Param('guildId') guildId: string,
    @Body('banRoles') banRoles: any[],
    @Body('kickRoles') kickRoles: any[],
    @Body('muteRoles') muteRoles: any[],
    @Body('permSite') permSite: any,
    @Body('muteRole') muteRole: any,
  ) {
    const config = await this.guildServices.updateGuildPermissions(
      guildId,
      banRoles,
      kickRoles,
      muteRoles,
      permSite,
      muteRole,
    );
    this.wsHandler.guildPermissionUpdate(config);
    return config;
  }

  @Post(':guildId/config/logs')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateGuildLogs(
    @Param('guildId') guildId: string,
    @Body('banLogChannelId') banLogChannelId: string | undefined,
    @Body('kickLogChannelId') kickLogChannelId: string | undefined,
    @Body('muteLogChannelId') muteLogChannelId: string | undefined,
    @Body('entryLogChannelId') entryLogChannelId: string | undefined,
  ) {
    const config = await this.guildServices.updateGuildLogs(
      guildId,
      banLogChannelId,
      kickLogChannelId,
      muteLogChannelId,
      entryLogChannelId,
    );
    this.wsHandler.guildLogsUpdate(config);
    return config;
  }
  @Post(':guildId/config/influencer')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async updateInfluencer(
    @Param('guildId') guildId: string,
    @Body('influencerPainel') influencerPainel: string | undefined,
    @Body('influencerPerm') influencerPerm: any[],
    @Body('influencerRole') influencerRole: string,
    @Body('influencerInstagram') influencerInstagram: string,
  ) {
    const config = await this.guildServices.updateInfluencerConfig(
      guildId,
      influencerPainel,
      influencerPerm,
      influencerRole,
      influencerInstagram,
    );
    this.wsHandler.guildInfluencerUpdate(config);
    return config;
  }
}
