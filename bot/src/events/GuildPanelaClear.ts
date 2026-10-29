// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildsPanela } from "../typeorm/entities/GuildPanela";

export default class GuildMemberRemoveEvent extends BaseEvent {
  constructor(
    private readonly panelaRepository = AppDataSource.getRepository(
      GuildsPanela
    )
  ) {
    super("guildMemberRemove");
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = client.configs.get(member.guild.id);
    if (!config) return;
    const entities = await this.panelaRepository.find();
    entities.forEach((entity) => {
      if (entity.ladyGoldens.includes(member.id)) {
        entity.ladyGoldens = entity.ladyGoldens.filter(
          (id) => id !== member.id
        );
      }

      if (entity.antBans.includes(member.id)) {
        entity.antBans = entity.antBans.filter((id) => id !== member.id);
      }

      if (entity.imagePerms.includes(member.id)) {
        entity.antBans = entity.antBans.filter((id) => id !== member.id);
      }
    });

    await this.panelaRepository.save(entities);
  }
}
