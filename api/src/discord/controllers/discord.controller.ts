import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from '../../utils/decorators';
import { ROUTES, SERVICES } from '../../utils/constants';
import { IDiscordService } from '../interfaces/discord';
import { User } from '../../utils/typeorm/entities/User';
import { AuthenticatedGuard } from '../../auth/utils/Guards';
import { RolePermissionGuard } from 'src/rolepermission/utils/RolePermissionGuard';
import { DiscordService } from '../services/discord.service';

@Controller(ROUTES.DISCORD)
export class DiscordController {
  constructor(
    @Inject(DiscordService) private readonly discordService: IDiscordService,
    @Inject(RolePermissionGuard) private roleGuard: RolePermissionGuard,
  ) {}
  @Get('guilds')
  @UseGuards(AuthenticatedGuard)
  getMutualGuilds(@AuthUser() user: User) {
    return this.discordService.getMutualGuilds(
      user.accessToken,
      user.discordId,
    );
  }
  @Get('guilds/:guildId/channels')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildChannels(@Param('guildId') guildId: string) {
    const { data } = await this.discordService.getGuildChannels(guildId);
    return data.filter((channel) => channel.type === 0);
  }
  @Get('guilds/:guildId/channels/all')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getAllGuildChannels(@Param('guildId') guildId: string) {
    const { data } = await this.discordService.getGuildChannels(guildId);

    return data.filter(
      (channel) =>
        channel.type === 0 || channel.type === 2 || channel.type === 4,
    );
  }
  @Get('guilds/:guildId/roles')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildRoles(@Param('guildId') guildId: string) {
    const { data } = await this.discordService.getGuildRoles(guildId);
    return data;
  }

  @Get('guilds/:guildId/bans')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildBans(@Param('guildId') guildId: string) {
    const { data } = await this.discordService.getGuildBans(guildId);
    return data;
  }

  @Delete('guilds/:guildId/bans/:userId')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async deleteGuildBans(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ) {
    const { data } = await this.discordService.deleteGuildBan(guildId, userId);
    return data;
  }

  @Get('guilds/:guildId/users/:userId')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildUser(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ) {
    const { data } = await this.discordService.getGuildUser(guildId, userId);
    return data;
  }

  @Get('guilds/:guildId/emojis')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async getGuildEmojis(@Param('guildId') guildId: string) {
    const { data } = await this.discordService.getGuildEmojis(guildId);
    return data;
  }

  @Put('guilds/:guildId/bans/:userId')
  @UseGuards(AuthenticatedGuard, RolePermissionGuard)
  async createGuildBan(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
    @Body('reason') reason: string,
  ) {
    const { data } = await this.discordService.createGuildBan(
      guildId,
      userId,
      reason,
    );
    return data;
  }
}
