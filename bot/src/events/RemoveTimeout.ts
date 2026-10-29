// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { GuildMember } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";
export default class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super("guildMemberUpdate");
  }

  async run(
    client: DiscordClient,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    const config = client.configs.get(oldMember.guild.id);
    if (config && config.botId === client.user?.id) {
      if (oldMember.guild.id === "1029217647314870313") {
        if (newMember.communicationDisabledUntil) {
          //remove timeout if its over 1 hour of timeout
          if (
            newMember.communicationDisabledUntil.getTime() -
              new Date().getTime() >
            3600000
          ) {
            await newMember.timeout(
              null,
              "Timeout Removido pois foi maior que 1 hora"
            );
          }
        }
      }
    }
  }
}
