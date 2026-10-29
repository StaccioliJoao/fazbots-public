import {
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class KickCommand extends BaseCommand {
  constructor() {
    super("kick", "mod", ["Kick"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    const permittedRoles = config?.kickPermRoles || [];
    let kickChannelId = config?.kickLogChannelId || "";
    const kickLogChannel = message.guild?.channels.cache.get(
      kickChannelId
    ) as TextChannel;
    if (
      message.member?.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member?.roles.cache.some((role) =>
        permittedRoles.includes(role.id)
      )
    ) {
      let kickMember =
        message.mentions.members?.first() ||
        message.guild?.members.cache.get(args[0]);
      var reason = args.splice(1).join(" ") || "Não informado.";
      if (!kickMember) {
        message.channel
          .send("**Você deve mencionar algum usuário a ser expulso!**")
          .then((msg) => {
            setTimeout(() => msg.delete(), 5000);
          });
        return;
      } else {
        const authorRole = message.member.roles.highest;
        const targetRole = kickMember.roles.highest;
        if (targetRole.comparePositionTo(authorRole) >= 0) {
          const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              "**<:erro:1017575876264743012> | Você não possui permissão para expulsar este usuário!**"
            );
          return message.channel
            .send({ embeds: [errorEmbed] })
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            })
            .catch((err) => console.log(err));
        } else {
          const kickEmbed = new EmbedBuilder()
            .setColor(0xffa500)
            .setTitle("<:kick:1017576994441023618> | Expulso")
            .setThumbnail(kickMember.displayAvatarURL())
            .addFields(
              {
                name: "<:member:1016520230572396544> Membro Expulso:",
                value:
                  kickMember.user.username +
                  "#" +
                  kickMember.user.discriminator +
                  " `" +
                  kickMember.user.username +
                  "#" +
                  kickMember.user.discriminator +
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
            await kickMember.user.send({ embeds: [kickEmbed] });
          } catch (err) {
            console.log(err);
          }
          try {
            await kickMember.kick(reason);
          } catch (err) {
            console.log(err);
          }
          try {
            await kickLogChannel?.send({ embeds: [kickEmbed] });
            await message.channel
              .send({ embeds: [kickEmbed] })
              .then((msg) => {
                setTimeout(() => msg.delete(), 10000);
              })
              .catch((err) => console.log(err));
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }
}
