import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class SetAvatarCommand extends BaseCommand {
  constructor() {
    super("setAvatar", "botInfo", ["setAv", "setIcon", "setFoto"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guild!.id);
    if (config) {
      if (message.member?.roles.cache.has(config.permSite)) {
        const messageAttachment =
          message.attachments.size > 0
            ? message.attachments.first()?.url
            : null;
        if (messageAttachment) {
          try {
            await client.user?.setAvatar(messageAttachment);
          } catch (err) {
            return await message.channel
              .send(`**Espere 30 minutos para utilizar o comando novamente!**`)
              .then((msg) => {
                setTimeout(() => msg.delete(), 5000);
              });
          }
          await message.channel
            .send(`**Foto do bot alterado com sucesso!**`)
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            });
        } else {
          const imageError = new EmbedBuilder()
            .setDescription(
              "**<:erro:1017575876264743012> | Você não forneceu uma foto!**"
            )
            .setColor(0xff0000)
            .setTimestamp();
          return message.channel
            .send({
              embeds: [imageError],
            })
            .then((msg) => {
              setTimeout(() => msg.delete(), 8000);
            });
        }
      }
    }
  }
}
