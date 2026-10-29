import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './utils/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { DiscordModule } from './discord/discord.module';
import { GuildsModule } from './guilds/guilds.module';
import { webSocketModule } from './websocket/websocket.module';
import { GuildsPd } from './utils/typeorm/entities/GuildsPd';
import { GuildsActiveMembers } from './utils/typeorm/entities/GuildsActiveMembers';
import { GuildsVerified } from './utils/typeorm/entities/GuildsVerified';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: Number(process.env.POSTGRES_DB_PORT) || 5432,
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_DATABASE,
      entities: entities,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    DiscordModule,
    GuildsModule,
    webSocketModule,
    GuildsPd,
    GuildsActiveMembers,
    GuildsVerified,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
