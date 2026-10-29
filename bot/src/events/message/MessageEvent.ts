import BaseEvent from "../../utils/structures/BaseEvent";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  TextChannel,
} from "discord.js";
import DiscordClient from "../../client/client";
import { GuildsInstagram } from "../../typeorm/entities/GuildsInstagram";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsActiveMembers } from "../../typeorm/entities/GuildsActiveMembers";

export default class MessageEvent extends BaseEvent {
  constructor(
    private readonly guildsInstagramRepository = AppDataSource.getRepository(
      GuildsInstagram
    ),
    private readonly activeMemberRepository = AppDataSource.getRepository(
      GuildsActiveMembers
    )
  ) {
    super("messageCreate");
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    const config = client.configs.get(message.guildId!);
    if (!config) {
      message.channel.send("Bot não consta na base de dados!");
      return;
    }
    if (
      message.content.toLowerCase().startsWith(config.prefix) &&
      config.botId === client.user?.id
    ) {
      message.delete();
      const [cmdName, ...cmdArgs] = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/\s+/);
      const command = client.commands.get(cmdName);
      if (command) {
        command.run(client, message, cmdArgs);
      }
    }
    const instaChannelId = config?.instagramChannelId || "";
    const instaChannelIds = ["1079522813548974080", "1079522845471821854"];
    instaChannelIds.push(instaChannelId);
    const activeMemberToggle = config.activeMemberToggle;
    const instaChannel = message.guild?.channels.cache.get(
      instaChannelId
    ) as TextChannel;
    try {
      if (activeMemberToggle === true && !message.author.bot) {
        const activeMemberRoles = config.activeMemberRole;
        if (activeMemberRoles.length > 0) {
          const userTrack = await this.activeMemberRepository.findOne({
            where: {
              guildId: message.guild?.id,
              userId: message.author.id,
            },
          });
          const member = message.member;
          const updatedAvatar = member!.user.avatar || "";
          if (userTrack) {
            let newCount = userTrack.msgCount + 1;
            if (
              config.activeMemberGoal &&
              newCount >= config.activeMemberGoal
            ) {
              try {
                await message.member?.roles.add(activeMemberRoles);
              } catch (err) {
                return console.log(err);
              }
              if (config.activeMemberMsg && userTrack.status === "unset") {
                try {
                  message.channel
                    .send(
                      `${config.activeMemberMsg.replace(
                        /{member}/g,
                        `${message.member}`
                      )}`
                    )
                    .then((msg) => {
                      setTimeout(() => msg.delete(), 7000);
                    });
                } catch (err) {
                  return console.log(err);
                }
              }
              await this.activeMemberRepository.save({
                ...userTrack,
                msgCount: newCount,
                avatar: updatedAvatar,
                username: member!.user.tag,
                status: "set",
              });
            } else {
              await this.activeMemberRepository.save({
                ...userTrack,
                avatar: updatedAvatar,
                username: member!.user.tag,
                msgCount: newCount,
              });
            }
          } else {
            const newUserTrack = this.activeMemberRepository.create({
              guildId: message.guild?.id,
              userId: message.author.id,
              msgCount: 1,
              avatar: updatedAvatar,
              username: member!.user.tag,
              status: "unset",
            });
            await this.activeMemberRepository.save(newUserTrack);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (instaChannelIds.includes(message.channel.id)) {
      const channel = message.guild?.channels.cache.get(
        message.channel.id
      ) as TextChannel;
      message.delete();
      const webhook = channel.fetchWebhooks().then((hooks) => {
        if (hooks.size > 0) {
          return hooks.find((hook) => hook.name === "Instagram webhook");
        } else {
          return instaChannel.createWebhook({
            name: "Instagram webhook",
          });
        }
      });
      var likeEmoji = "1018343999465070604";
      var commentEmoji = "1018576176211579001";
      var viewLikeEmoji = "1018344642133102663";
      var viewCommentEmoji = "1018344034424598528";
      if (config.likeEmoji) {
        likeEmoji = config.likeEmoji;
      }
      if (config.commentEmoji) {
        commentEmoji = config.commentEmoji;
      }
      if (config.viewLikeEmoji) {
        viewLikeEmoji = config.viewLikeEmoji;
      }
      if (config.viewCommentEmoji) {
        viewCommentEmoji = config.viewCommentEmoji;
      }
      if (message.attachments.size > 0) {
        const img_url = message.attachments.first()?.url || "";
        const body = `> ${message.author}:\n ${message.content
          .replace("@here", "")
          .replace("@everyone", "")}`;
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_like")
            .setLabel("0")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(likeEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_add_comment")
            .setLabel("0")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(commentEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_comment")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(viewCommentEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_view_likes")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(viewLikeEmoji)
        );
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("instagram_delete_post")
            .setLabel("Apagar 🗑️")
            .setStyle(ButtonStyle.Danger)
        );
        webhook.then(async (webhook) => {
          try {
            const msg = await webhook?.send({
              content: body,
              username: message.author.username,
              avatarURL:
                message.author.avatarURL() || message.author.defaultAvatarURL,
              files: [img_url],
              components: [row],
            });
            const newPost = this.guildsInstagramRepository.create({
              guildId: message.guild?.id,
              channelId: webhook?.channelId,
              postId: msg?.id,
              userId: message.author.id,
              likeCount: 0,
              likeUsers: [],
              comments: [],
            });
            await this.guildsInstagramRepository.save(newPost);
          } catch (err) {
            console.log(err);
          }
        });
      }
    }
  }
}
