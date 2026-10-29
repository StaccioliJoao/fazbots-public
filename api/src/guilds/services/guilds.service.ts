import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuildConfiguration } from '../../utils/typeorm/entities/GuildConfiguration';
import { IsNull, Not, Repository } from 'typeorm';
import { IGuildsService } from '../interfaces/guilds';
import {
  ActiveMember,
  ActiveMemberDb,
  PdPerm,
  PdUser,
  userPd,
  VerifiedMember,
  VerifiedMemberDb,
} from 'src/utils/types';
import { GuildsPd } from '../../utils/typeorm/entities/GuildsPd';
import { WebsocketHandler } from '../../websocket/socket';
import { GuildsActiveMembers } from '../../utils/typeorm/entities/GuildsActiveMembers';
import { GuildsVerified } from 'src/utils/typeorm/entities/GuildsVerified';

@Injectable()
export class GuildsService implements IGuildsService {
  constructor(
    @InjectRepository(GuildConfiguration)
    private readonly guildConfigRepository: Repository<GuildConfiguration>,
    @InjectRepository(GuildsPd)
    private readonly guildPdRepository: Repository<userPd>,
    @InjectRepository(GuildsActiveMembers)
    private readonly guildActiveMembersRepository: Repository<ActiveMemberDb>,
    @InjectRepository(GuildsVerified)
    private readonly guildVerifiedMembersRepository: Repository<VerifiedMemberDb>,
    @Inject(WebsocketHandler)
    private readonly wsHandler: WebsocketHandler,
  ) {}
  async resetGuildActiveMembers(guildId: string) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const toBeReset = await this.guildActiveMembersRepository.find({
        where: { guildId: guildId },
      });
      await this.guildActiveMembersRepository.remove(toBeReset);
      return this.wsHandler.guildResetActiveMembers(guildId, toBeReset);
    }
  }
  async resetGuildVerifiedMembers(guildId: string) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const toBeReset = await this.guildVerifiedMembersRepository.find({
        where: { guildId: guildId },
      });
      await this.guildVerifiedMembersRepository.remove(toBeReset);
      return this.wsHandler.guildResetVerifiedMembers(guildId, toBeReset);
    }
  }

  async resetGuildPds(guildId: string) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const toBeReset = await this.guildPdRepository.find({
        where: {
          guildId: guildId,
        },
      });
      await this.guildPdRepository.remove(toBeReset);
      return this.wsHandler.guildResetPds(guildId, toBeReset);
    }
  }

  async removeGuildPd(guildId: string, userId: string, PD: PdUser) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const userPDs = await this.guildPdRepository.findOne({
        where: {
          guildId: guildId,
          userId: userId,
        },
      });
      const index = userPDs?.pdList.findIndex((pd) => pd.userId === PD.userId);
      const newPds = userPDs?.pdList;
      newPds?.splice(index, 1);
      try {
        return this.guildPdRepository.save({
          ...userPDs,
          pdList: newPds,
        });
      } catch (err) {
        throw new HttpException('Algo falhou.', HttpStatus.BAD_REQUEST);
      }
    }
  }
  async removeGuildActiveMember(guildId: string, userId: string) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const activeMember = await this.guildActiveMembersRepository.findOne({
        where: { guildId: guildId, userId: userId },
      });
      try {
        return this.guildActiveMembersRepository.delete(activeMember);
      } catch (err) {
        throw new HttpException('Algo falhou.', HttpStatus.BAD_REQUEST);
      }
    }
  }
  async removeGuildVerifiedMember(guildId: string, userId: string) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const verifiedMember = await this.guildVerifiedMembersRepository.findOne({
        where: { guildId: guildId, userId: userId },
      });
      try {
        return this.guildVerifiedMembersRepository.delete(verifiedMember);
      } catch (err) {
        throw new HttpException('Algo falhou.', HttpStatus.BAD_REQUEST);
      }
    }
  }
  async getGuildPds(guildId: string): Promise<userPd[]> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const guildPds = await this.guildPdRepository.find({
        where: {
          guildId: guildId,
        },
      });
      let returnPds = [];
      for (let guildPd of guildPds) {
        if (guildPd.pdList.length > 0) {
          returnPds.push(guildPd);
        }
      }
      return returnPds;
    }
  }

  async getGuildMembrosAtivos(guildId: string): Promise<ActiveMember[]> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const guildMembrosAtivos = await this.guildActiveMembersRepository.find({
        where: {
          guildId: guildId,
          status: 'set',
        },
      });
      return guildMembrosAtivos;
    }
  }

  async getGuildMembrosVerificados(guildId: string): Promise<VerifiedMember[]> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const guildMembrosVerificados =
        await this.guildVerifiedMembersRepository.find({
          where: {
            guildId: guildId,
          },
        });
      return guildMembrosVerificados;
    }
  }

  async updateGuildPd(
    guildId: string,
    pdRole: string,
    pdPerms: PdPerm[],
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (!pdRole) {
        pdRole = guildConfig.pdRole;
      }
      if (!pdPerms) {
        pdPerms = guildConfig.pdPerms;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        pdRole,
        pdPerms,
      });
    }
  }

  async updateGuildVerification(
    guildId: string,
    verifiedLogChannelId: string,
    verifierRole: string,
    verifiedRole: string,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (!verifiedLogChannelId) {
        verifiedLogChannelId = guildConfig.verifiedLogChannel;
      }
      if (!verifierRole) {
        verifierRole = guildConfig.verifierRole;
      }
      if (!verifiedRole) {
        verifiedRole = guildConfig.verifiedRole;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        verifiedLogChannel: verifiedLogChannelId,
        verifierRole,
        verifiedRole,
      });
    }
  }
  async updateGuildPermissions(
    guildId: string,
    banRoles: any[],
    kickRoles: any[],
    muteRoles: any[],
    permSite: any,
    muteRole: any,
  ) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (!banRoles) {
        banRoles = guildConfig.banPermRoles;
      } else if (!kickRoles) {
        kickRoles = guildConfig.kickPermRoles;
      } else if (!muteRoles) {
        muteRoles = guildConfig.mutePermRoles;
      } else if (!permSite) {
        permSite = guildConfig.permSite;
      } else if (!muteRole) {
        muteRole = guildConfig.permSite;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        banPermRoles: banRoles,
        kickPermRoles: kickRoles,
        mutePermRoles: muteRoles,
        permSite: permSite,
        muteRole: muteRole,
      });
    }
  }
  async updateInstagramChannel(
    guildId: string,
    instagramChannelId: string,
    likeEmoji: string | undefined,
    commentEmoji: string | undefined,
    viewCommentEmoji: string | undefined,
    viewLikeEmoji: string | undefined,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    else {
      if (!instagramChannelId) {
        instagramChannelId = guildConfig.instagramChannelId;
      }
      if (!likeEmoji) {
        likeEmoji = guildConfig.likeEmoji;
      }
      if (!commentEmoji) {
        commentEmoji = guildConfig.commentEmoji;
      }
      if (!viewCommentEmoji) {
        viewCommentEmoji = guildConfig.viewCommentEmoji;
      }
      if (!viewLikeEmoji) {
        viewLikeEmoji = guildConfig.viewLikeEmoji;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        instagramChannelId,
        likeEmoji,
        commentEmoji,
        viewCommentEmoji,
        viewLikeEmoji,
      });
    }
  }
  async updateInfluencerConfig(
    guildId: string,
    influencerPainel: string,
    influencerPerm: any[],
    influencerRole: string,
    influencerInstagram: string,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.guildConfigRepository.save({
      ...guildConfig,
      influencerPainel,
      influencerPerm,
      influencerRole,
      influencerInstaChannel: influencerInstagram,
    });
  }
  async updateWelcomeChannel(
    guildId: string,
    welcomeChannelId: string,
    welcomeChannelMessage: string,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    else {
      if (!welcomeChannelId) {
        welcomeChannelId = guildConfig.welcomeChannelId;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        welcomeChannelId,
        welcomeChannelMessage,
      });
    }
  }
  async updateHourCounter(
    guildId: string,
    deafToggle: boolean,
    muteToggle: boolean,
    rolesToCount: string[],
    counterPerms: string[],
    counterCategories: string[],
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    else {
      if (!rolesToCount) {
        rolesToCount = guildConfig.hourCounterRoles;
      }
      if (!counterPerms) {
        counterPerms = guildConfig.hourCounterPerms;
      }
      if (!counterCategories) {
        counterCategories = guildConfig.counterCategories;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        deafToggle,
        muteToggle,
        hourCounterRoles: rolesToCount,
        hourCounterPerms: counterPerms,
        counterCategories,
      });
    }
  }
  async updateVoiceCounter(
    guildId: string,
    voiceCountChannelId: string,
    voiceCountMsg: string,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (!voiceCountChannelId) {
        voiceCountChannelId = guildConfig.voicecountChannelId;
      }
      if (!voiceCountMsg) {
        voiceCountMsg = guildConfig.voiceCountMsg;
      }

      return this.guildConfigRepository.save({
        ...guildConfig,
        voicecountChannelId: voiceCountChannelId,
        voiceCountMsg: voiceCountMsg,
      });
    }
  }

  async updateMemberCounter(
    guildId: string,
    channelId: string,
    counterEmojis: string[],
    counterMsg: string,
  ) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (!channelId) {
        channelId = guildConfig.memberCountId;
      }
      if (!counterEmojis) {
        counterEmojis = guildConfig.memberCountEmojis;
      }
      if (!counterMsg) {
        counterMsg = guildConfig.memberCountMsg;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        memberCountId: channelId,
        memberCountEmojis: counterEmojis,
        memberCountMsg: counterMsg,
      });
    }
  }

  async updateTellonymConfig(
    guildId: string,
    postChannel: string,
    createChannel: string,
    voteChannel: string,
    embedMsg: string,
    embedImg: string,
    tellonymRoles: string[],
    tellonymColors: string,
    tellonymLimit: number,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (!postChannel) {
        postChannel = guildConfig.tellonymPostChannel;
      }
      if (!createChannel) {
        createChannel = guildConfig.tellonymCreateChannel;
      }
      if (!voteChannel) {
        voteChannel = guildConfig.tellonymVoteChannel;
      }
      if (!embedMsg) {
        embedMsg = guildConfig.tellonymText;
      }
      if (!embedImg) {
        embedImg = guildConfig.tellonymImg;
      }
      if (!tellonymRoles) {
        tellonymRoles = guildConfig.tellonymRoles;
      }
      if (!tellonymColors) {
        tellonymColors = guildConfig.tellonymColors;
      }
      if (!tellonymLimit) {
        tellonymLimit = guildConfig.tellonymLimit;
      }
      return this.guildConfigRepository.save({
        ...guildConfig,
        tellonymPostChannel: postChannel,
        tellonymCreateChannel: createChannel,
        tellonymVoteChannel: voteChannel,
        tellonymText: embedMsg,
        tellonymImg: embedImg,
        tellonymColors: tellonymColors,
        tellonymRoles: tellonymRoles,
        tellonymLimit: tellonymLimit,
      });
    }
  }

  async updateGuildPrefix(
    guildId: string,
    prefix: string,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    return this.guildConfigRepository.save({ ...guildConfig, prefix });
  }

  async updateGuildLogs(
    guildId: string,
    banLogChannelId: string | undefined,
    kickLogChannelId: string | undefined,
    muteLogChannelId: string | undefined,
    entryLogChannelId: string | undefined,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.guildConfigRepository.save({
      ...guildConfig,
      banLogChannelId,
      kickLogChannelId,
      muteLogChannelId,
      entryLogChannelId,
    });
  }

  async updateMigrarConfig(
    guildId: string,
    channelId: string,
    migrarRoles: string[],
    migrarChannelMsg: string,
    migrarChannelImg: string,
    migrarColor: string,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.guildConfigRepository.save({
      ...guildConfig,
      migrarChannelId: channelId,
      migrarRoles,
      migrarChannelText: migrarChannelMsg,
      migrarChannelImg,
      migrarColor,
    });
  }

  async updateSejaMembroConfig(
    guildId: string,
    channelId: string,
    sejaMembroMsg: string,
    sejaMembroImg: string,
    sejaMembroColor: string,
    sejaMembroRoles: string[],
    sejaMembroVerify: string[],
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.guildConfigRepository.save({
      ...guildConfig,
      sejaMembroChannel: channelId,
      sejaMembroColor,
      sejaMembroImg,
      sejaMembroRoles,
      sejaMembroText: sejaMembroMsg,
      sejaMembroVerify,
    });
  }

  async updateRegisterConfig(
    guildId: string,
    channelId: string,
    registerChannelMsg: string,
    registerChannelImg: string,
    maleRole: string,
    femaleRole: string,
    underRole: string,
    overRole: string,
    registerColor: string,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.guildConfigRepository.save({
      ...guildConfig,
      registerChannelId: channelId,
      registerChannelText: registerChannelMsg,
      registerChannelImg,
      registerMale: maleRole,
      registerFemale: femaleRole,
      registerUnder: underRole,
      registerOver: overRole,
      registerColor,
    });
  }
  async updateActiveMemberConfig(
    guildId: string,
    activeMemberMessage: string,
    activeMemberGoal: number,
    activeMemberPerms: string[],
    activeMemberRoles: string[],
    activeMemberToggle: boolean,
  ): Promise<GuildConfiguration> {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig) {
      throw new HttpException(
        'Configuração da Guild não encontrada',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.guildConfigRepository.save({
      ...guildConfig,
      activeMemberMsg: activeMemberMessage,
      activeMemberGoal,
      activeMemberPerms,
      activeMemberRole: activeMemberRoles,
      activeMemberToggle,
    });
  }
  async getGuildConfig(guildId: string) {
    const configs = await this.guildConfigRepository.findOne({ guildId });
    configs.botToken = 'null';
    return configs;
  }
}
