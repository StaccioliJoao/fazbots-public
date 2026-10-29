import { DataSource } from "typeorm";
import { GuildBanLog } from "../entities/GuildBan";
import { GuildConfiguration } from "../entities/GuildConfiguration";
import { GuildHourCounter } from "../entities/GuildHourCounter";
import { GuildInfluencers } from "../entities/GuildInfluencers";
import { GuildMutes } from "../entities/GuildMutes";
import { GuildsRegisterCounter } from "../entities/GuildRegisterCounter";
import { GuildsActiveMembers } from "../entities/GuildsActiveMembers";
import { GuildsInstagram } from "../entities/GuildsInstagram";
import { GuildsMigrar } from "../entities/GuildsMigrar";
import { GuildsPd } from "../entities/GuildsPd";
import { GuildsVerified } from "../entities/GuildsVerified";
import { GuildsVerification } from "../entities/GuildVerification";
import { InfluencerInstagram } from "../entities/InfluencerInstagram";
import { GuildCoins } from "../entities/GuildCoins";
import { MTA } from "../entities/MTA";
import { GuildMessageCounter } from "../entities/GuildMessageCounter";
import { GuildsTeams } from "../entities/GuildTeams";
import { GuildsPanela } from "../entities/GuildPanela";
import { GuildClans } from "../entities/GuildClan";
require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT) || 5432,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_DATABASE,
  synchronize: true,
  entities: [
    GuildConfiguration,
    GuildBanLog,
    GuildMutes,
    GuildsInstagram,
    GuildsPd,
    GuildsMigrar,
    GuildsActiveMembers,
    GuildsVerified,
    GuildsVerification,
    GuildsRegisterCounter,
    MTA,
    GuildHourCounter,
    InfluencerInstagram,
    GuildInfluencers,
    GuildCoins,
    GuildMessageCounter,
    GuildsTeams,
    GuildsPanela,
    GuildClans,
  ],
});
