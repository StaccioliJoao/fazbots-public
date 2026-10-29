import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuildConfiguration } from '../utils/typeorm/entities/GuildConfiguration';
import { SERVICES } from '../utils/constants';
import { DiscordController } from './controllers/discord.controller';
import { DiscordHttpService } from './services/discord-http.service';
import { DiscordService } from './services/discord.service';
import { RolePermissionModule } from 'src/rolepermission/role-permission.module';
import { RolePermissionGuard } from 'src/rolepermission/utils/RolePermissionGuard';

@Module({
  imports: [TypeOrmModule.forFeature([GuildConfiguration])],

  controllers: [DiscordController],

  providers: [
    DiscordService,
    {
      provide: SERVICES.DISCORD_HTTP,
      useClass: DiscordHttpService,
    },
    RolePermissionGuard,
  ],
  exports: [DiscordService],
})
export class DiscordModule {}
