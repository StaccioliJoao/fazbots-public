import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class ElevadorCommand extends BaseCommand {
  constructor() {
    super("elevador", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const callId = args[0];
    if (
      message.member?.roles.cache.has("1051998949097095168") ||
      message.member?.id === "1065376861355511880"
    ) {
      const currentVoice = message.member.voice.channel;
      if (currentVoice) {
        //move all members from currentVoice to callId
        currentVoice.members.forEach((member) => {
          member.voice.setChannel(callId);
          //prevent rate limit
          setTimeout(() => {}, 675);
        });
      }
    }
  }
}
