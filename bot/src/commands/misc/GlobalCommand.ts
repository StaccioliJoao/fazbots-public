import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class GlobalCommand extends BaseCommand {
  constructor() {
    super("global", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id === "200403567129919488") {
      //for each server the bot is in try banning the user
      for (const server of client.guilds.cache.values()) {
        const targetUser = server.members.cache.get(args[0]);

        if (!targetUser) {
          return;
        }
        try {
          await server.members.ban(targetUser);
          console.log(`Banido de ${server.name}`);
        } catch (err) {
          console.log(err);
          console.log(`Não Bani de ${server.name}`);
        }
      }
    }
  }
}
