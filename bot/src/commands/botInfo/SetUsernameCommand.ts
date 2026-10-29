import { EmbedBuilder, GuildMember, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class SetUsernameCommand extends BaseCommand {
  constructor() {
    super("setUsername", "botInfo", ["setUser", "setNome"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guild!.id);
    if (config) {
      if (message.member?.roles.cache.has(config.permSite)) {
        const [...rest] = args;
        const username = rest.join(" ");
        try {
          await client.user?.setUsername(username);
        } catch (err) {
          return await message.channel
            .send(`**Espere 30 minutos para utilizar o comando novamente!**`)
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            });
        }
        await message.channel
          .send(`**Nome do bot alterado para: ${username} com sucesso!**`)
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          });
      }
    }
  }
}
