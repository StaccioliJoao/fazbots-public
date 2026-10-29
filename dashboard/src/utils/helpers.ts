import { PartialGuild, User } from './types';


export const getIconURL = (guild: PartialGuild) =>
  `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;

export const getUserIconURL = (user: User | undefined) =>
user?`https://cdn.discordapp.com/avatars/${user?.discordId}/${user?.avatar}.png`:
undefined