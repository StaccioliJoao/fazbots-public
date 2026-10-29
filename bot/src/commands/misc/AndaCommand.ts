import {
  CategoryChannel,
  ChannelType,
  GuildMember,
  Message,
  VoiceChannel,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class AndaCommand extends BaseCommand {
  constructor() {
    super("anda", "Misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.member?.guild.id === "1029217647314870313") {
      const allowedMembers = [
        "200403567129919488",
        "1065376861355511880",
        "966173938696736830",
        "741761621050916925",
        "1116789101312626870",
        "317111777966030848",
        "316310490890502154",
        "717879995149713419",
      ];

      if (
        allowedMembers.includes(message.author.id) ||
        message.member?.roles.cache.has("1051998949097095168") ||
        message.member.id === "609192594215534615"
      ) {
        const categoryToMove = "1079851831406104576";
        const userToMove =
          (message.guild?.members.cache.get(args[0]) as GuildMember) ||
          (message.mentions.members?.first() as GuildMember);
        if (allowedMembers.includes(userToMove.id)) {
          return await message.channel
            .send("Vc n pode me mover fdp!")
            .then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 5000);
            });
        } else {
          const category = message.guild?.channels.cache.get(
            categoryToMove
          ) as CategoryChannel;
          const currentChannel = userToMove.voice?.channel;
          //check if the user is in a voice channel
          if (!userToMove.voice) {
            return;
          }
          //move the user from channel to channel from the category
          category.children.cache.forEach((channel) => {
            if (channel.isVoiceBased()) {
              if (userToMove.voice) {
                userToMove.voice.setChannel(channel as VoiceChannel);
                //respect the discord rate limit to keep consistency in move rate
                setTimeout(() => {}, 700);
              }
            }
          });
          //move the user back to the channel they were in before
          if (currentChannel) {
            userToMove.voice?.setChannel(currentChannel);
          }
        }
      }
    } else if (message.member?.guild.id === "1094017941881757747") {
      const allowedMembers = ["200403567129919488", "1041191292253773855"];

      if (allowedMembers.includes(message.author.id)) {
        const allVoiceChannels = message.guild?.channels.cache
          .filter((channel) => channel.type === ChannelType.GuildVoice)
          .map((channel) => channel);
        const userToMove =
          (message.guild?.members.cache.get(args[0]) as GuildMember) ||
          (message.mentions.members?.first() as GuildMember);
        if (allowedMembers.includes(userToMove.id)) {
          return await message.channel
            .send("Vc n pode me mover fdp!")
            .then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 5000);
            });
        } else {
          const currentChannel = userToMove.voice?.channel;
          //check if the user is in a voice channel
          if (!userToMove.voice) {
            return;
          }
          //move the user from channel to channel from the category
          allVoiceChannels?.forEach((channel) => {
            if (channel.isVoiceBased()) {
              if (userToMove.voice) {
                userToMove.voice.setChannel(channel as VoiceChannel);
                //respect the discord rate limit to keep consistency in move rate
                setTimeout(() => {}, 700);
              }
            }
          });
          //move the user back to the channel they were in before
          if (currentChannel) {
            userToMove.voice?.setChannel(currentChannel);
          }
        }
      }
    }
  }
}
