import {
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildMutes } from "../../typeorm/entities/GuildMutes";

export default class UnmuteCommand extends BaseCommand {
  constructor(
    private readonly muteLogRepository = AppDataSource.getRepository(GuildMutes)
  ) {
    super("unmute", "mod", ["Unmute", "desmutar", "Desmute", "Desmutar"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    const mutedRole = message.guild?.roles.cache.get(config!.muteRole) || "";
    const permittedRoles = config?.mutePermRoles || [];
    let muteChannelId = config?.muteLogChannelId || "";
    const muteLogChannel = message.guild?.channels.cache.get(
      muteChannelId
    ) as TextChannel;
    if (
      message.member?.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member?.roles.cache.some((role) =>
        permittedRoles.includes(role.id)
      )
    ) {
      const muteMember =
        message.mentions.members?.first() ||
        message.guild?.members.cache.get(args[0]);
      const reason = args[1] || "Não informado.";
      const noUserError = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "**<:erro:1017575876264743012> | Você deve mencionar um usuário a ser desmutado!**"
        );
      if (!muteMember) {
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
        const dbMute = await this.muteLogRepository.findOne({
          where: {
            guildId: message.guild!.id,
            mutedMemberID: muteMember!.id,
          },
        });
        if (!dbMute) {
          console.log("oi");
          const noDbMute = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              "**<:erro:1017575876264743012> | Usuário não está mutado!**"
            );
          return message.channel
            .send({ embeds: [noDbMute] })
            .then((msg) => {
              setTimeout(() => {
                try {
                  msg.delete();
                } catch (err) {}
              }, 5000);
            })
            .catch((err) => console.log(err));
        }
        const authorRole = message.member.roles.highest;
        const targetRole = muteMember.roles.highest;
        if (targetRole.comparePositionTo(authorRole) >= 0) {
          const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              "**<:erro:1017575876264743012> | Você não possui permissão para desmutar este usuário!**"
            );
          return message.channel
            .send({ embeds: [errorEmbed] })
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
            muteMember.roles.remove(mutedRole);
          } catch (err) {}
          const guildMuteLog = this.muteLogRepository.delete({
            guildId: message.guild?.id!,
            mutedMemberID: muteMember.id,
          });
          const unMuteEmbed = new EmbedBuilder()
            .setColor(0xffff00)
            .setDescription(
              `**<:unmute:1017834901724213279> | ${muteMember} não está mais mutado.**`
            );
          message.channel.send({ embeds: [unMuteEmbed] }).then((msg) => {
            setTimeout(() => {
              try {
                msg.delete();
              } catch (err) {}
            }, 5000);
          });
          const muteEmbed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle("<:muted:1017824272191860906> | Desmutado")
            .setThumbnail(muteMember.displayAvatarURL())
            .addFields(
              {
                name: "<:member:1016520230572396544> Membro Desmutado:",
                value:
                  muteMember.user.username +
                  "#" +
                  muteMember.user.discriminator +
                  " `" +
                  muteMember.user.username +
                  "#" +
                  muteMember.user.discriminator +
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
              {
                name: "<:motivo:1016520872368017418> Motivo:",
                value: reason,
                inline: true,
              }
            )
            .setTimestamp();
          try {
            muteLogChannel.send({ embeds: [muteEmbed] });
          } catch (err) {}
        }
      }
    }
  }
}
