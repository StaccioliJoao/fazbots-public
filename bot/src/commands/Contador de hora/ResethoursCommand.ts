import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildHourCounter } from "../../typeorm/entities/GuildHourCounter";
export default class ResethoursCommand extends BaseCommand {
  constructor(
    private readonly guildsHourCounter = AppDataSource.getRepository(
      GuildHourCounter
    )
  ) {
    super("resethours", "Contador de hora", ["reset"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    if (message.member?.roles.cache.hasAny(...config!.hourCounterPerms)) {
      const allUsers = await this.guildsHourCounter.find({
        where: {
          guildId: message.guild!.id,
        },
      });
      allUsers.forEach((user) => {
        user.totalTime = 0;
        user.joinTime = new Date(0);
        user.leaveTime = new Date(0);
      });
      await this.guildsHourCounter.save(allUsers);
      await message.channel
        .send("**Contador de horas do servidor resetado!**")
        .then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });
    }
  }
}
