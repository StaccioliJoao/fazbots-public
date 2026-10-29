import { EmbedBuilder, Message, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsVerified } from "../../typeorm/entities/GuildsVerified";

export default class VerificarCommand extends BaseCommand {
  constructor(
    private readonly verifiedRepository = AppDataSource.getRepository(
      GuildsVerified
    )
  ) {
    super("verificar", "Verification", ["Verificar", "verifica", "Verifica"]);
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
          const verifiedRole =
            message.guild?.roles.cache.get(config!.verifiedRole) || "";
          if (verifiedRole) {
            const verificarEmbed = new EmbedBuilder()
              .setDescription(
                `**${message.guild?.name} Verificação\n\n <a:verificado:1041108150436241450>| ${message.member} verificou ${user} com sucesso!\n Cargo recebido: ${verifiedRole}**`
              )
              .setTimestamp()
              .setColor(0x08062d)
              .setThumbnail(
                "https://cdn.discordapp.com/emojis/1041108150436241450.gif?size=2048"
              );
            try {
              user.roles.add(verifiedRole);
              const guildVerifiedUser = this.verifiedRepository.create({
                guildId: message.guild?.id!,
                userId: user.id,
                userName: user.displayName,
                verifierId: message.author.id,
                verifierName: message.member?.displayName,
                userAvatar: user.user.avatar || "",
              });
              await this.verifiedRepository.save(guildVerifiedUser);
              message.channel
                .send({ embeds: [verificarEmbed] })
                .then((msg) => {
                  setTimeout(() => {
                    try {
                      msg.delete();
                    } catch (err) {}
                  }, 5000);
                })
                .catch((err) => console.log(err));
              try {
                let verifiedLogChannelId = config?.verifiedLogChannel || "";
                const verifiedLogChannel = message.guild?.channels.cache.get(
                  verifiedLogChannelId
                ) as TextChannel;
                const verificarLog = new EmbedBuilder()
                  .setDescription(
                    `**${message.guild?.name} Verificação\n\n <:admin_fazbot:1016521117093077122> Verificador:${message.member} \n<:member_fazbot:1016520230572396544> Verificado:${user} \nCargo recebido: ${verifiedRole}**`
                  )
                  .setTimestamp()
                  .setColor(0x08062d)
                  .setThumbnail(
                    "https://cdn.discordapp.com/emojis/1041108150436241450.gif?size=2048"
                  );
                verifiedLogChannel.send({ embeds: [verificarLog] });
              } catch (err) {
                console.log(err);
              }
            } catch (err) {
              console.log(err);
            }
          }
        } else {
          const alreadyVerifiedError = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              "**<:erro:1017575876264743012> | Este usuário já está verificado!**"
            );
          return message.channel
            .send({ embeds: [alreadyVerifiedError] })
            .then((msg) => {
              setTimeout(() => {
                try {
                  msg.delete();
                } catch (err) {}
              }, 5000);
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }
}
