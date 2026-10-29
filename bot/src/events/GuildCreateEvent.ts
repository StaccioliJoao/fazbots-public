// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
require("dotenv").config();
import { Guild } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";

export default class GuildCreateEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository = AppDataSource.getRepository(
      GuildConfiguration
    )
  ) {
    super("guildCreate");
  }

  async run(client: DiscordClient, guild: Guild) {
    const config = await this.guildConfigRepository.findOne({
      where: {
        guildId: guild.id,
      },
    });
    if (config) {
      client.configs.set(guild.id, config);
    } else {
      const newConfig = this.guildConfigRepository.create({
        guildId: guild.id,
        botId: client.user?.id,
        botToken: process.env.TOKEN,
        ownerId: guild.ownerId,
      });
      const savedConfig = await this.guildConfigRepository.save(newConfig);
      client.configs.set(guild.id, savedConfig);
    }
  }
}
