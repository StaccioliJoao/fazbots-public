import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../utils/typeorm/entities/User';
import { Repository } from 'typeorm';
import { GuildConfiguration } from 'src/utils/typeorm/entities/GuildConfiguration';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordService } from 'src/discord/services/discord.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(GuildConfiguration)
    private readonly guildConfiguration: Repository<GuildConfiguration>,
    @Inject(DiscordService) private discordService: DiscordService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Assuming the user object is attached by the AuthGuard
    const guildId = request.params.guildId; // Extract the guild ID from the request parameters
    console.log(
      'verificando cargos de:',
      user.username,
      'em:',
      request.route.path,
      'passando:',
      request.body,
      'guildID:',
      guildId,
    );

    // Fetch the guild configuration from the database based on the guild ID
    const guildConfiguration = await this.guildConfiguration.findOne({
      guildId,
    });
    if (!guildConfiguration) {
      return false; // The guild configuration is not found, deny access
    }

    // Assuming you have a property in GuildConfiguration that holds the role permissions
    const requiredPermissions = guildConfiguration.permSite;
    if (!requiredPermissions) {
      console.log('permissao denied');
      return false; // If no role permission is specified, deny access
    }
    // Fetch the guild's roles from the Discord API using the DiscordHttpService
    const guildRolesResponse = await this.discordService.getUserGuildRoles(
      guildId,
      String(user.discordId),
    );
    if (!guildRolesResponse) {
      return false;
    }
    const guildRoles = guildRolesResponse.data;

    // Implement your logic to check if the user has the required role permission
    // You can compare the fetched guildRoles with the requiredPermissions
    const userHasPermission = guildRoles.roles.includes(requiredPermissions);
    if (!userHasPermission) {
      console.log('permissao denied');
      return false;
    }
    console.log('permissao concedida');
    return userHasPermission;
  }
}
