import { Module, forwardRef } from '@nestjs/common';
import { DiscordHttpService } from '../discord/services/discord-http.service';
import { RolePermissionGuard } from './utils/RolePermissionGuard';
import { GuildConfiguration } from '../utils/typeorm/entities/GuildConfiguration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  imports: [DiscordModule, TypeOrmModule.forFeature([GuildConfiguration])],

  providers: [RolePermissionGuard],

  exports: [RolePermissionGuard],
})
export class RolePermissionModule {}
