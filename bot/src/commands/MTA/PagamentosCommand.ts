import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { MTA } from "../../typeorm/entities/MTA";

export default class PagamentosCommand extends BaseCommand {
  constructor(
    private readonly MTARepository = AppDataSource.getRepository(MTA)
  ) {
    super("pagamentos", "MTA", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (
      message.author.id === "200403567129919488" ||
      message.author.id === "689934740676935828" ||
      message.author.id === "326136645755731969" ||
      message.member?.roles.cache.has("1081047693113176064")
    ) {
      const allPayments = await this.MTARepository.find({});
      const newArr = allPayments.map((el) => ({
        ...el,
        aPagar: 0,
      }));
      const toBePayed = allPayments
        .map((payment) => {
          if (payment.aPagar > 0) {
            return payment;
          }
        })
        .filter((notUndefined) => notUndefined !== undefined);
      if (toBePayed.length > 0) {
        let msg = "";
        toBePayed.forEach((payment) => {
          msg += `<@${payment?.discordId}> | ID: ${payment?.mtaID} | Valor: ${payment?.aPagar}\n`;
        });
        await message.channel.send(msg);
        await this.MTARepository.save(newArr);
      }
    }
  }
}
