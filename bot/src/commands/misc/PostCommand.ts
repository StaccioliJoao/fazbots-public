import {
  AttachmentBuilder,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  TextChannel,
  WebhookClient,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import fs from "fs";
import https from "https";

export default class PostCommand extends BaseCommand {
  constructor() {
    super("post", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
      await message.channel.send("Digite o titulo:");
      const filter = (m: any) => m.author.id === message.author.id;
      message.channel
        .awaitMessages({
          filter,
          max: 1,
          time: 30000,
          errors: ["time"],
        })
        .then(async (message) => {
          const msg = message.first();
          const title = msg?.content || "";
          await msg?.channel.send("Digite a descrição:");
          msg?.channel
            .awaitMessages({
              filter,
              max: 1,
              time: 30000,
              errors: ["time"],
            })
            .then(async (message) => {
              const msg = message.first();
              const description = msg?.content || "";
              await msg?.channel.send(
                "Digite o código de cor hex da embed: Ex. #ff0000"
              );
              msg?.channel
                .awaitMessages({
                  filter,
                  max: 1,
                  time: 30000,
                  errors: ["time"],
                })
                .then(async (message) => {
                  const msg = message.first();
                  let color = msg?.content || "";
                  await msg?.channel.send("Deseja adicionar imagens? (s/n)");
                  msg?.channel
                    .awaitMessages({
                      filter,
                      max: 1,
                      time: 30000,
                      errors: ["time"],
                    })
                    .then(async (message) => {
                      const response = message.first();
                      if (
                        response?.content.toLowerCase() === "s" ||
                        response?.content.toLowerCase() === "sim"
                      ) {
                        await response?.channel.send("Envie a imagem:");
                        response?.channel
                          .awaitMessages({
                            filter,
                            max: 1,
                            time: 30000,
                            errors: ["time"],
                          })
                          .then(async (message) => {
                            const msg = message.first();
                            if (msg && msg.attachments.size > 0) {
                              const attachment = msg.attachments.first();
                              if (attachment) {
                                const img_url =
                                  msg.attachments.first()?.url || "";
                                const savechannel = client.channels.cache.get(
                                  "1046456985975005244"
                                ) as TextChannel;
                                const savedimg = await savechannel.send({
                                  files: [img_url],
                                });
                                const saved_url =
                                  savedimg.attachments.first()?.url || "";
                                color = color.replace("#", "");
                                console.log(img_url);
                                const newEmbed = new EmbedBuilder()
                                  .setColor(`#${color}`)
                                  .setTitle(title)
                                  .setDescription(description)
                                  .setImage(saved_url)
                                  .setFooter({
                                    text: `Todos os direitos reservados, ${msg?.guild?.name}. ©️`,
                                    iconURL: msg!.guild!.iconURL() || "",
                                  });
                                return msg?.channel.send({
                                  embeds: [newEmbed],
                                });
                              }
                            }
                          });
                      } else {
                        color = color.replace("#", "");
                        const newEmbed = new EmbedBuilder()
                          .setColor(`#${color}`)
                          .setTitle(title)
                          .setDescription(description)
                          .setFooter({
                            text: `Todos os direitos reservados, ${msg?.guild?.name}. ©️`,
                            iconURL: msg!.guild!.iconURL() || "",
                          });

                        return response?.channel.send({ embeds: [newEmbed] });
                      }
                    });
                });
            });
        });
    }
  }
}
