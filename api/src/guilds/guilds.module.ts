import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildConfiguration } from '../utils/typeorm/entities/GuildConfiguration';
import { SERVICES } from '../utils/constants';
import { GuildsController } from './controllers/guilds.controller';
import { GuildsService } from './services/guilds.service';
import { webSocketModule } from '../websocket/websocket.module';
import { GuildsPd } from '../utils/typeorm/entities/GuildsPd';
import { GuildsActiveMembers } from '../utils/typeorm/entities/GuildsActiveMembers';
import { GuildsVerified } from 'src/utils/typeorm/entities/GuildsVerified';
import { RolePermissionModule } from 'src/rolepermission/role-permission.module';
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuildConfiguration]),
    TypeOrmModule.forFeature([GuildsPd]),
    TypeOrmModule.forFeature([GuildsActiveMembers]),
    TypeOrmModule.forFeature([GuildsVerified]),
    webSocketModule,
    RolePermissionModule,
    DiscordModule,
  ],
  controllers: [GuildsController],
  providers: [{ provide: SERVICES.GUILDS, useClass: GuildsService }],
})
export class GuildsModule {}
