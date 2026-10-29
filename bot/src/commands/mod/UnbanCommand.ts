import {
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  TextChannel,
  User,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class UnbanCommand extends BaseCommand {
  constructor() {
    super("unban", "mod", [
      "Unban",
      "Desbanir",
      "desbanir",
      "desban",
      "Desban",
    ]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    let banChannelId = config?.banLogChannelId || "";
    const permittedRoles = config?.banPermRoles || [];
    const banLogsChannel = message.guild?.channels.cache.get(
      banChannelId
    ) as TextChannel;
    if (
      message.member?.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member?.roles.cache.some((role) =>
        permittedRoles.includes(role.id)
      )
    ) {
      var userId;
      if (args[0]) {
        userId = args[0];
      } else {
        const noUserError = new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(
            "**<:erro:1017575876264743012> | Você deve mencionar um usuário a ser desbanido!**"
          );
        return message.channel
          .send({ embeds: [noUserError] })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          })
          .catch((err) => console.log(err));
      }
      var unbanUser;
      try {
        unbanUser =
          message.mentions.users?.first() ||
          ((await client.users.fetch(userId)) as User);
      } catch (err) {
        const noUserError = new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(
            "**<:erro:1017575876264743012> | Você deve mencionar um usuário a ser desbanido!**"
          );
        return message.channel
          .send({ embeds: [noUserError] })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          })
          .catch((err) => console.log(err));
      }
      const reason = args[1] || "Não informado.";
      const noUserError = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Você deve mencionar um usuário a ser desbanido!**"
        );
      if (!unbanUser) {
        return message.channel
          .send({ embeds: [noUserError] })
          .then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          })
          .catch((err) => console.log(err));
      } else {
        try {
          await message.guild?.members.unban(unbanUser);
        } catch (err) {}
      }
      const unbanEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("<:ban:1016516904006979625> | Unban")
        .setThumbnail(unbanUser.displayAvatarURL())
        .addFields(
          {
            name: "<:member:1016520230572396544> Membro Desbanido:",
            value:
              unbanUser.username +
              "#" +
              unbanUser.discriminator +
              " `" +
              unbanUser.username +
              "#" +
              unbanUser.discriminator +
              "`",
            inline: true,
          },
          {
            name: "<:admin:1016521117093077122> Administrador:",
            value:
              `<@${message.author.id}> ` +
              "`" +
              message.author.username +
              "#" +
              message.author.discriminator +
              "`",
            inline: true,
          },
          { name: "<:motivo:1016520872368017418> Motivo:", value: reason }
        )
        .setTimestamp();
      try {
        banLogsChannel.send({ embeds: [unbanEmbed] });
      } catch (err) {}
      const unBannedEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`**${unbanUser} não está mais banido.**`);
      try {
        message.channel.send({ embeds: [unBannedEmbed] }).then((msg) => {
          setTimeout(() => {
            try {
              msg.delete();
            } catch (err) {}
          }, 5000);
        });
      } catch (err) {}
    }
  }
}
