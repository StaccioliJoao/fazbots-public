import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";
import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  EmbedBuilder,
  GuildChannel,
  GuildMember,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { InfluencerInstagram } from "../../typeorm/entities/InfluencerInstagram";
import { IgApiClient } from "instagram-private-api";
import * as fs from "fs";
import axios from "axios";
const ig = new IgApiClient();

export default class ReadyEvent extends BaseEvent {
  constructor(
    private readonly InfluencerInstagramRepository = AppDataSource.getRepository(
      InfluencerInstagram
    )
  ) {
    super("ready");
  }
  async run(client: DiscordClient) {
    console.log("Bot has logged in as " + client.user?.id);
    const Allconfig = client.configs;
    let correctConfig = Allconfig.find(
      (config) => config.botId === client.user?.id
    );
    const config = correctConfig;
    if (config) {
      client.user?.setActivity(`Prefixo: ${config.prefix}`, {
        type: ActivityType.Listening,
      });
    } else {
      client.user?.setActivity(`Prefixo: !`, {
        type: ActivityType.Listening,
      });
    }

    await client.guilds.fetch();
    if (config?.guildId) {
      const botGuild = client.guilds.cache.get(config.guildId);
      if (botGuild) {
        await botGuild.members.fetch();
        const banUsers = [
          "431208540149907456",
          "144627438536622081",
          "957137346648748082",
          "784282968931041302",
          "734779661376159917",
          "379013773366788096",
          "933131073502736405",
          "760503168378339398",
          "1133423612003622963",
        ];
        banUsers.forEach(async (user) => {
          const guildMember = botGuild.members.cache.get(user);
          if (guildMember) {
            console.log(`Banindo: ${guildMember}`);
            await guildMember.ban({ reason: `É us D` });
          }
        });
      }
    }

    setInterval(() => {
      if (config)
        try {
          const guild = client.guilds.cache.get(config.guildId);
          const voiceChannels = guild!.channels.cache.filter(
            (c) => c.type === 2
          );
          let counter = 0;
          for (let vc of voiceChannels) {
            const voice = client.channels.cache.get(vc[0]) as VoiceChannel;
            counter += voice.members.size;
          }
          const voiceChannel = client.channels.cache.get(
            config.voicecountChannelId
          ) as GuildChannel;
          if (voiceChannel) {
            console.log(
              `${config.voiceCountMsg.replace("{counter}", counter.toString())}`
            );
            voiceChannel.edit({
              name: `${config.voiceCountMsg.replace(
                /{counter}/g,
                `${counter}`
              )}`,
            });
          }
        } catch (error) {
          console.log(error);
        }
    }, 365558);
    setInterval(() => {
      if (config && config!.memberCountEmojis)
        try {
          const guild = client.guilds.cache.get(config.guildId);
          const memberCountChannel = guild!.channels.cache.get(
            config.memberCountId
          ) as TextChannel;
          guild!.emojis.fetch();
          let emojiMentions = config.memberCountEmojis.map((emoji) => {
            return guild?.emojis.cache.get(emoji);
          });
          var guildMemberCount = guild!.memberCount.toString();
          var emojiGuildCount = "";
          for (let i = 0; i < guildMemberCount.length; i++) {
            if (guildMemberCount[i] === "9") {
              if (emojiMentions[9]?.animated) {
                emojiGuildCount += `<a:${emojiMentions[9].name}:${emojiMentions[9].id}>`;
              } else {
                emojiGuildCount += `<:${emojiMentions[9]?.name}:${emojiMentions[9]?.id}>`;
              }
            } else if (guildMemberCount[i] === "0") {
              if (emojiMentions[0]?.animated) {
                emojiGuildCount += `<a:${emojiMentions[0]?.name}:${emojiMentions[0]?.id}>`;
              } else {
                emojiGuildCount += `<:${emojiMentions[0]?.name}:${emojiMentions[0]?.id}>`;
              }
            } else {
              let num = parseInt(guildMemberCount[i]);
              if (emojiMentions[num]?.animated) {
                emojiGuildCount += `<a:${emojiMentions[num]?.name}:${emojiMentions[num]?.id}>`;
              } else {
                emojiGuildCount += `<:${emojiMentions[num]?.name}:${emojiMentions[num]?.id}>`;
              }
            }
          }
          try {
            console.log(emojiGuildCount);
            const guildCountFinal = config.memberCountMsg.replace(
              /{counter}/,
              `${emojiGuildCount}`
            );
            if (memberCountChannel) {
              memberCountChannel.setTopic(guildCountFinal);
            }
          } catch (err) {
            console.log(err);
          }
        } catch (error) {
          console.log(error);
        }
    }, 365558);
    setInterval(async () => {
      if (!config) {
        return;
      }
      if (!config.influencerInstaChannel) {
        return;
      }
      if (!fs.existsSync(process.env.IG_SESSION_FILE || "./data/ig-session.json")) {
        if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD) {
          return;
        }
        ig.state.generateDevice(process.env.IG_USERNAME);
        await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
        const cookies = await ig.state.serializeCookieJar();
        fs.writeFileSync(process.env.IG_SESSION_FILE || "./data/ig-session.json", JSON.stringify(cookies));
      } else {
        await ig.state.deserializeCookieJar(
          fs.readFileSync(process.env.IG_SESSION_FILE || "./data/ig-session.json", "utf8")
        );
      }
      const guildInfluencers = await this.InfluencerInstagramRepository.find({
        where: {
          guildId: config?.guildId,
        },
      });
      const guild = client.guilds.cache.get(config!.guildId);
      if (!guild) {
        return;
      }
      for (let influencer of guildInfluencers) {
        const userId = await ig.user.getIdByUsername(
          `${influencer.instagramHandle}`
        );
        const feed = await ig.feed.user(userId).items();
        const latestPost = feed[0];
        if (influencer.latestPosts.includes(latestPost.code)) {
          await new Promise((resolve) => setTimeout(resolve, 20000));
          continue;
        }
        const postUrl = `https://www.instagram.com/p/${latestPost.code}/`;
        const userAvatar = latestPost.user.profile_pic_url;
        var imageUrl;
        if (latestPost.carousel_media_count) {
          const carouselMedia = latestPost.carousel_media;
          imageUrl = carouselMedia![0].image_versions2.candidates[0].url;
        } else {
          imageUrl = latestPost.image_versions2.candidates[0].url;
        }
        const caption = latestPost.caption?.text;
        const exampleEmbed = new EmbedBuilder()
          .setColor(0xc13584)
          .setAuthor({
            name: `${latestPost.user.username}`,
            iconURL: `${userAvatar}`,
          })
          .setDescription(`${caption}`)
          .setImage(`${imageUrl}`)
          .setTimestamp()
          .setFooter({
            text: `${guild?.name} Influencer`,
            iconURL: `${guild?.iconURL()}`,
          });
        const row = new ActionRowBuilder<ButtonBuilder>();
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Ir a post")
            .setStyle(ButtonStyle.Link)
            .setURL(`${postUrl}`)
        );
        const channel = client.channels.cache.get(
          config.influencerInstaChannel
        ) as TextChannel;
        if (channel) {
          const msg = await channel.send({
            embeds: [exampleEmbed],
            components: [row],
          });
          influencer.latestPosts.push(latestPost.code);
          await this.InfluencerInstagramRepository.save(influencer);
          //add cooldown to not get rate limited
          await new Promise((resolve) => setTimeout(resolve, 38000));
        }
      }
    }, 600000);

    const supCategory = client.channels.cache.get(
      "1087416112532160653"
    ) as CategoryChannel;
    const verifyCategory = client.channels.cache.get(
      "1130914294226243708"
    ) as CategoryChannel;
    if (supCategory && verifyCategory) {
      setInterval(async () => {
        const guild = client.guilds.cache.get(config!.guildId);
        if (!guild) {
          return;
        }
        await guild.channels.fetch();
        const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000; // Calculate the timestamp 30 minutes ago
        const supVoiceChannels = supCategory.children.cache.filter(
          (c) => c.type === 2 && c.name.startsWith("📞 |")
        );
        const verifyVoiceChannels = verifyCategory.children.cache.filter(
          (c) => c.type === 2 && c.name.startsWith("🔎 |")
        );
        supVoiceChannels.forEach(async (channel) => {
          if (
            channel.members.size === 0 &&
            channel.createdTimestamp < thirtyMinutesAgo
          ) {
            await channel.delete();
          }
        });
        verifyVoiceChannels.forEach(async (channel) => {
          if (
            channel.members.size === 0 &&
            channel.createdTimestamp < thirtyMinutesAgo
          ) {
            await channel.delete();
          }
        });
      }, 60000);
    }

    // Find the channel where you want to send the message
    const channelId = "1125919655081558056";
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (channel && client.user?.id === "994738336566620201") {
      setInterval(async () => {
        if (config && config!.hourCounterRoles) {
          let totalStaffInVoiceChannels = 0;
          const guild = client.guilds.cache.get(config.guildId);
          if (!guild) {
            return;
          }
          await guild.channels.fetch();
          const voiceChannels = guild!.channels.cache.filter(
            (c) => c.type === 2
          );
          let totalUsersInVoiceChannels = 0;
          for (let vc of voiceChannels) {
            const voice = client.channels.cache.get(vc[0]) as VoiceChannel;
            totalUsersInVoiceChannels += voice.members.size;
            voice.members.forEach((member) => {
              if (member.roles.cache.hasAny(...config.hourCounterRoles)) {
                totalStaffInVoiceChannels += 1;
              }
            });
          }
          const difference =
            totalUsersInVoiceChannels - totalStaffInVoiceChannels;
          const membersCallBreakdown = new EmbedBuilder()
            .setDescription(
              `**Membros em call ${guild.name}**\n\n 👥 Usuários em call: ${totalUsersInVoiceChannels}\n 🛡️ Staffs em call: ${totalStaffInVoiceChannels}\n ➖ Membros não staff: ${difference}`
            )
            .setColor(0x0000ff)
            .setTimestamp();
          channel.send({ embeds: [membersCallBreakdown] });
        }
      }, 60000); // 60000 milliseconds = 1 minute
    }
  }
}
