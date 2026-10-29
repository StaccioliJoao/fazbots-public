import { EmbedBuilder, Message, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsVerified } from "../../typeorm/entities/GuildsVerified";

export default class RverificarCommand extends BaseCommand {
  constructor(
    private readonly verifiedRepository = AppDataSource.getRepository(
      GuildsVerified
    )
  ) {
    super("rverificar", "Verification", [
      "RVerificar",
      "rverifica",
      "rVerifica",
      "RVerificar",
    ]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    if (config) {
      const verifierRole = config.verifierRole;
      const memberRoles = message.member?.roles.cache;
      if (memberRoles?.has(verifierRole)) {
        const user =
          message.mentions.members?.first() ||
          message.guild?.members.cache.get(args[0]);
        if (!user) {
          const noUserError = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              "**<:erro:1017575876264743012> | Você deve mencionar um usuário a ser verificado!**"
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
        const verifiedUser = await this.verifiedRepository.findOne({
          where: {
            guildId: message.guildId!,
            userId: user.id,
          },
        });
        if (!verifiedUser) {
          try {
            await user.roles.remove(config.verifiedRole);
          } catch (err) {}
          const notVerifiedError = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              "**<:erro:1017575876264743012> | Este usuário não está verificado!**"
            );
          return message.channel
            .send({ embeds: [notVerifiedError] })
            .then((msg) => {
              setTimeout(() => {
                try {
                  msg.delete();
                } catch (err) {}
              }, 5000);
            })
            .catch((err) => console.log(err));
        } else {
          await this.verifiedRepository.delete(verifiedUser);

          const verifiedRole =
            message.guild?.roles.cache.get(config!.verifiedRole) || "";
          if (verifiedRole) {
            try {
              await user.roles.remove(verifiedRole);
            } catch (err) {}
            const removerVerificadoEmbed = new EmbedBuilder()
              .setDescription(
                `**${message.guild?.name} Verificação\n\n <a:unverify:1041413253487673425>| ${message.member} removeu verificado de ${user}!\n Cargo removido: ${verifiedRole}**`
              )
              .setTimestamp()
              .setColor(0xf04947)
              .setThumbnail(
                "https://cdn.discordapp.com/emojis/1041413253487673425.gif?size=2048"
              );
            try {
              message.channel
                .send({ embeds: [removerVerificadoEmbed] })
                .then((msg) => {
                  setTimeout(() => {
                    try {
                      msg.delete();
                    } catch (err) {}
                  }, 5000);
                })
                .catch((err) => console.log(err));
            } catch (err) {}
            try {
              let verifiedLogChannelId = config?.verifiedLogChannel || "";
              const verifiedLogChannel = message.guild?.channels.cache.get(
                verifiedLogChannelId
              ) as TextChannel;
              const verificarLog = new EmbedBuilder()
                .setDescription(
                  `**${message.guild?.name} Verificação\n\n <:admin_fazbot:1016521117093077122> Verificador:${message.member} \n<:member_fazbot:1016520230572396544> Membro:${user} \nCargo removido: ${verifiedRole}**`
                )
                .setTimestamp()
                .setColor(0xf04947)
                .setThumbnail(
                  "https://cdn.discordapp.com/emojis/1041413253487673425.gif?size=2048"
                );
              verifiedLogChannel.send({ embeds: [verificarLog] });
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    }
  }
}
