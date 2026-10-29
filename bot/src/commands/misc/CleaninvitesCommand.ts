import { Message, PermissionFlagsBits } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class CleaninvitesCommand extends BaseCommand {
  constructor() {
    super("cleaninvites", "Misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
      const invites = await message.guild?.invites.fetch();
      if (invites) {
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        for (const invite of invites.values()) {
          console.log(invite.code);
          await invite.delete();
          await delay(1000); // Wait 1 second between each invite deletion
        }
      }
    }
  }
}
