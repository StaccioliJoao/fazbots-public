import { ColorResolvable, EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class EcheckCommand extends BaseCommand {
  constructor() {
    super("echeck", "misc", ["chk"]);
  }

  identifyCreditCardType(cardNumber: string): string | null {
    //regext to identify credit card type with Unionpay, Diners Club, JCB, Discover, American Express, Mastercard and Visa
    const creditCardRegex =
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

    if (!creditCardRegex.test(cardNumber)) {
      return null;
    }

    switch (true) {
      case /^4/.test(cardNumber):
        return "Visa";
      case /^5[1-5]/.test(cardNumber):
        return "Mastercard";
      case /^3[47]/.test(cardNumber):
        return "American Express";
      case /^3(?:0[0-5]|[68][0-9])/.test(cardNumber):
        return "Diners Club";
      case /^6(?:011|5[0-9]{2})/.test(cardNumber):
        return "Discover";
      case /^(?:2131|1800|35\d{3})/.test(cardNumber):
        return "JCB";
      default:
        return null;
    }
  }
  getRandomStringFromArray(array: string[]): string {
    const randomIndex: number = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guild!.id);
    const cardNumber = args[0];
    const expirationDate = args[1];
    const cvv = args[2];
    const cardType = this.identifyCreditCardType(cardNumber);
    console.log(cardType, cardNumber, expirationDate, cvv);
    if (!cardNumber || !expirationDate || !cvv || !cardType) {
      message.channel
        .send(
          `**Você deve utilizar o comando ${config?.prefix}chk <número> <data> <cvv>!**`
        )
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      return;
    }
    if (cardType) {
      const cardBool: string[] = ["dead", "alive"];
      const randomCardBool: string = this.getRandomStringFromArray(cardBool);
      let hexColor: string | null = null;
      let discordColor: ColorResolvable | null = null;
      if (randomCardBool === "dead") {
        hexColor = "#FF0000"; // red
      } else if (randomCardBool === "alive") {
        hexColor = "#00FF00"; // green
      }
      if (hexColor !== null) {
        discordColor = hexColor as ColorResolvable; // convert hex string to color
      }
      const embed = new EmbedBuilder()
        .setTitle(`${message.guild!.name} - Echeck`)
        .setDescription(
          `**Status**: \`${randomCardBool}\`\n**Numero do cartão**: \`${cardNumber}\` \n **Bandeira**: \`${cardType}\`\n **Data de expiração**: \`${expirationDate}\`\n **CVV**: \`${cvv}\``
        )
        .setColor(discordColor)
        .setTimestamp()
        .setFooter({
          text: `Comando executado por ${message.author.tag}`,
          iconURL: message.author.avatarURL()!,
        });
      await message.channel.send({ embeds: [embed] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
    }
  }
}
