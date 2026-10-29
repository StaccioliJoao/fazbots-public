import { Message, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class ClCommand extends BaseCommand {
  constructor() {
    super("cl", "misc", ["CL", "Cl", "cL"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const channel = message.channel as TextChannel;
    const user = message.member;
    channel.messages
      .fetch({
        limit: 100,
      })
      .then((messages) => {
        if (user) {
          messages = messages.filter(
            (message) => message.author.id === user.id
          );
        }
        try {
          channel.bulkDelete(messages, true);
        } catch (error) {
          console.log("error cl");
        }
      });
  }
}
