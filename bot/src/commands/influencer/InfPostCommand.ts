import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class InfPostCommand extends BaseCommand {
  constructor() {
    super("infPost", "influencer", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    //this command will create a embed to post a influencer in a channel, the embed will contain the influencer discord, instagram link, a image and 3 buttons one for likes one to open their discord profile and another for open their instagram profile
    const config = client.configs.get(message.guildId!);
    if (config) {
      //first I want to check if the user has the role to use this command
      if (!message.member?.roles.cache.hasAny(...config.influencerPerm)) {
        return await message.channel
          .send("Você não tem permissão para usar esse comando")
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          });
      }
      //first I want to create a embed with 3 buttons to fill in the influencer info with the gray color
      const embed = new EmbedBuilder()
        .setTitle(`Postar Influencer - ${message.guild?.name}`)
        .setDescription(
          `Discord do influencer:\nInstagram do influencer:\nTikTok do Influencer:`
        )
        .setImage(
          "https://upload.wikimedia.org/wikipedia/en/5/5a/Black_question_mark.png"
        )
        .setColor(0x808080)
        .setFooter({
          text: "Clique nos botões abaixo para preencher as informações",
          iconURL: message.guild!.iconURL() || "",
        });
      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Discord")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("influencer_post_discord")
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Instagram")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("influencer_post_instagram")
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("TikTok")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("influencer_post_tiktok")
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Imagem")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("influencer_post_image")
      );
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Postar")
          .setStyle(ButtonStyle.Success)
          .setCustomId("influencer_post")
      );
      message.channel.send({ embeds: [embed], components: [row] });
    }
  }
}
