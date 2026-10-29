import {
  CategoryChannel,
  ChannelType,
  Message,
  PermissionFlagsBits,
  VoiceChannel,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class OrganizarCommand extends BaseCommand {
  constructor() {
    super("organizar", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
      const category =
        (message.mentions.channels.first() as CategoryChannel) ||
        (message.guild?.channels.cache.get(args[0]) as CategoryChannel);

      if (category) {
        const channelsToSort = category.children.cache;
        const voiceChannels = channelsToSort.filter(
          (channel) => channel.type === ChannelType.GuildVoice
        );
        if (voiceChannels) {
          const organizado = voiceChannels
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .reverse();
          const sortedVoiceChannelsArray = Array.from(organizado.values());

          for (let i = 0; i < sortedVoiceChannelsArray.length; i++) {
            const channel = sortedVoiceChannelsArray[i];
            await channel.setPosition(i);
          }
        }
      }
    }
  }
}
