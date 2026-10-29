import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsPd } from "../../typeorm/entities/GuildsPd";

export default class CleanupCommand extends BaseCommand {
  constructor(
    private readonly pdRepository = AppDataSource.getRepository(GuildsPd)
  ) {
    super("cleanup", "PD", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    if (config) {
      if (message.member?.roles.cache.has(config.permSite)) {
        await message.guild?.members.fetch();
        const pdRole = message.guild?.roles.cache.get(config.pdRole);
        if (pdRole) {
          console.log("entrei");
          const serverPds = pdRole.members;
          const Pds = await this.pdRepository.find({
            where: {
              guildId: message.guild?.id,
            },
          });
          var allPds: string[] = [];
          for (let userPd of Pds) {
            const userPds = userPd.pdList;
            for (let pd of userPds) {
              allPds.push(pd.userId);
            }
          }
          if (allPds) {
            serverPds.forEach((member) => {
              if (!allPds.includes(member.id)) {
                member.roles.remove(pdRole);
              }
            });
          }
        }
      }
    }
  }
}
