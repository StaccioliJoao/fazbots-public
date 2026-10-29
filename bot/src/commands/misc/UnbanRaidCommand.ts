import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class UnbanRaidCommand extends BaseCommand {
  constructor() {
    super("unbanRaid", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.author.id === "200403567129919488") {
      const guild = message.guild;
      if (!guild) {
        return;
      }
      await guild.bans.fetch();
      console.log("fetched bans");
      const allBans = guild?.bans;

      allBans?.cache.forEach(async (ban) => {
        if (ban.reason === "Ban via Painel fazbots teste ,Autor: surfa.#0") {
          console.log(`desbanindo - ${ban.user.username}`);
          await guild?.members.unban(ban.user.id);
        }
      });
    }
  }
}
