// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
import { Guild } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildConfiguration } from "../typeorm/entities/GuildConfiguration";

export default class GuildDeleteEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository = AppDataSource.getRepository(
      GuildConfiguration
    )
  ) {
    super("guildDelete");
  }

  async run(client: DiscordClient, guild: Guild) {
    const config = await this.guildConfigRepository.findOne({
      where: {
        guildId: guild.id,
      },
    });
    if (config) {
      this.guildConfigRepository.remove(config);
      client.configs.delete(guild.id);
    } else {
    }
  }
}
