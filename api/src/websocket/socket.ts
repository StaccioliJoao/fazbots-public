import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ActiveMemberDb, userPd, VerifiedMemberDb } from '../utils/types';
import { GuildConfiguration } from '../utils/typeorm/entities/GuildConfiguration';
@WebSocketGateway()
export class WebsocketHandler {
  @WebSocketServer()
  ws: Server;

  @SubscribeMessage('guilds')
  guildsHandler(@MessageBody() data: any) {
    console.log(data);
  }

  guildPrefixUpdate(config: GuildConfiguration) {
    this.ws.emit('guildPrefixUpdate', config);
  }
  guildVerificationUpdate(config: GuildConfiguration) {
    this.ws.emit('guildVerificationUpdate', config);
  }
  guildWelcomeUpdate(config: GuildConfiguration) {
    this.ws.emit('guildWelcomeUpdate', config);
  }
  updateHourCounter(config: GuildConfiguration) {
    this.ws.emit('updateHourCounter', config);
  }
  guildRemovePd(guildId: string, pdUserId: string) {
    this.ws.emit('removePd', guildId, pdUserId);
  }
  guildRemoveActiveMember(guildId: string, userId: string) {
    this.ws.emit('removeActiveMember', guildId, userId);
  }
  guildRemoveVerifiedMember(guildId: string, userId: string) {
    this.ws.emit('removeVerifiedMember', guildId, userId);
  }
  guildLogsUpdate(config: GuildConfiguration) {
    this.ws.emit('guildLogsUpdate', config);
  }
  guildResetPds(guildId: string, guildPds: userPd[]) {
    this.ws.emit('guildResetPds', guildId, guildPds);
  }
  guildResetActiveMembers(
    guildId: string,
    guildActiveMembers: ActiveMemberDb[],
  ) {
    this.ws.emit('guildResetActiveMembers', guildId, guildActiveMembers);
  }

  guildUpdateTellonym(config: GuildConfiguration) {
    this.ws.emit('guildTellonymUpdate', config);
  }

  guildResetVerifiedMembers(
    guildId: string,
    guildActiveMembers: VerifiedMemberDb[],
  ) {
    this.ws.emit('guildResetVerifiedMembers', guildId, guildActiveMembers);
  }
  guildInstagramUpdate(config: GuildConfiguration) {
    this.ws.emit('guildInstagramUpdate', config);
  }
  guildPermissionUpdate(config: GuildConfiguration) {
    this.ws.emit('guildPermissionUpdate', config);
  }
  guildPdUpdate(config: GuildConfiguration) {
    this.ws.emit('guildPdUpdate', config);
  }
  guildMigrarUpdate(config: GuildConfiguration) {
    this.ws.emit('guildMigrarUpdate', config);
  }
  guildSejaMembroUpdate(config: GuildConfiguration) {
    this.ws.emit('guildSejaMembroUpdate', config);
  }
  guildRegisterUpdate(config: GuildConfiguration) {
    this.ws.emit('guildRegisterUpdate', config);
  }
  guildInfluencerUpdate(config: GuildConfiguration) {
    this.ws.emit('guildInfluencerUpdate', config);
  }
}
