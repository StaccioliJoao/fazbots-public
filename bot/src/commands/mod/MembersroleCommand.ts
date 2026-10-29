import { Message, PermissionFlagsBits } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class MembersroleCommand extends BaseCommand {
  constructor() {
    super("membersrole", "mod", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (
      message.member?.permissions.has(PermissionFlagsBits.Administrator) &&
      message.member.roles.cache.has("1117611075106525225")
    ) {
      await message.guild?.members.fetch();
      const role =
        message.mentions.roles.first() ||
        message.guild?.roles.cache.get(args[0]);
      if (role) {
        const users = role.members.map((member) => member);
        await message.channel.send({
          content: `${users}`,
        });
      } else {
        message.channel
          .send("**Você deve mencionar algum cargo a ser puxado!**")
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          });
      }
    }
  }
}
