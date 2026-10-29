// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  TextChannel,
} from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildMutes } from "../typeorm/entities/GuildMutes";
import { AppDataSource } from "../typeorm/dataSource/dataSource";
import { fromMs } from "ms-typescript";

export default class GuildMemberAddEvent extends BaseEvent {
  constructor(
    private readonly muteLogRepository = AppDataSource.getRepository(GuildMutes)
  ) {
    super("guildMemberAdd");
  }

  async run(client: DiscordClient, member: GuildMember) {
    const config = client.configs.get(member.guild.id);
    const blacklist = [
      "431208540149907456",
      "144627438536622081",
      "227249623423516674",
      "385872742811172864",
      "957137346648748082",
      "784282968931041302",
      "734779661376159917",
      "379013773366788096",
      "933131073502736405",
      "760503168378339398",
      "1133423612003622963",
    ];
    if (blacklist.includes(member.id)) {
      await member.ban();
    }
  }
}
