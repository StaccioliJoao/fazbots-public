// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildUpdate
import { Guild } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
const request = require("request");

export default class GuildUpdateEvent extends BaseEvent {
  constructor() {
    super("guildUpdate");
  }

  async run(client: DiscordClient, oldGuild: Guild, newGuild: Guild) {
    const config = client.configs.get(newGuild.id);
    if (config?.botId === client.user?.id) {
      if (config?.urlProtectionToggle) {
        console.log(newGuild.vanityURLCode);
        if (newGuild.vanityURLCode !== config.urlProtectionVanity) {
          console.log("mudando");
          const settings = {
            url: `https://discord.com/api/v6/guilds/${config.guildId}/vanity-url`,
            body: {
              code: config.urlProtectionVanity,
            },
            json: true,
            method: "PATCH",
            headers: {
              Authorization: `Bot ${client.token}`,
            },
          };
          request(settings, (err, res, body) => {
            if (err) {
              console.log(err);
            }
            console.log(res);
          });
        }
      }
    }
  }
}
