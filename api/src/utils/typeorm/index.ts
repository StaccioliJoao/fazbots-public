import { GuildConfiguration } from './entities/GuildConfiguration';
import { User } from './entities/User';
import { Session } from './entities/Session';
import { GuildsPd } from './entities/GuildsPd';
import { GuildsActiveMembers } from './entities/GuildsActiveMembers';
import { GuildsVerified } from './entities/GuildsVerified';

export const entities = [
  GuildConfiguration,
  User,
  Session,
  GuildsPd,
  GuildsActiveMembers,
  GuildsVerified,
];
