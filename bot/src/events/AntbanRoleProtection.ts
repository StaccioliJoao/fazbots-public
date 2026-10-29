// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { GuildMember } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { GuildsPanela } from "../typeorm/entities/GuildPanela";
import { ArrayContains } from "typeorm";

export default class GuildMemberUpdateEvent extends BaseEvent {
  constructor(
    private readonly panelaRepository = AppDataSource.getRepository(
      GuildsPanela
    )
  ) {
    super("guildMemberUpdate");
  }

  async run(
    client: DiscordClient,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    const oldRoles = oldMember.roles;
    const newRoles = newMember.roles;
    const config = client.configs.get(oldRoles.guild.id);
    if (
      config &&
      config.botId === client.user?.id &&
      oldRoles.guild.id === "1029217647314870313"
    ) {
      if (newRoles.cache.has("1075283654189797486")) {
        const antbanTrack = await this.panelaRepository.findOne({
          where: {
            antBans: ArrayContains([oldMember.id]),
          },
        });
        if (!antbanTrack) {
          newMember.roles.remove("1075283654189797486");
        }
      }
    }
  }
}
