import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsPanela } from "../../typeorm/entities/GuildPanela";

export default class PermimgCommand extends BaseCommand {
  constructor(
    private readonly panelaRepository = AppDataSource.getRepository(
      GuildsPanela
    )
  ) {
    super("permimg", "misc", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const user =
      message.mentions.members?.first() ||
      message.guild?.members.cache.get(args[0]);
    const guildId = message.guild?.id;
    const permImgRole = message.guild?.roles.cache.get("1111279108974977055");
    if (!permImgRole) {
      return;
    }
    if (!guildId) {
      return;
    }
    if (!user) {
      return;
    }
    if (!["1029217647314870313", "1014556792325427240"].includes(guildId)) {
      return;
    }
    interface RolePermissions {
      [roleId: string]: {
        antban: number;
        ladyGolden: number;
        imagePermissions: number;
        woodPerms: number;
      };
    }
    const perms = {
      "1051998949097095168": {
        antban: 3,
        ladyGolden: 2,
        imagePermissions: 4,
        woodPerms: 3,
      },
      "1075283651987787876": {
        antban: 2,
        ladyGolden: 0,
        imagePermissions: 3,
        woodPerms: 2,
      },
      "1093535888132292770": {
        antban: 1,
        ladyGolden: 0,
        imagePermissions: 1,
        woodPerms: 0,
      },
      "1043218151665565726": {
        antban: 3,
        ladyGolden: 2,
        imagePermissions: 4,
        woodPerms: 0,
      },
      "1082465121881837619": {
        antban: 3,
        ladyGolden: 3,
        imagePermissions: 0,
        woodPerms: 0,
      },
      "1114253447584297031": {
        antban: 2,
        ladyGolden: 0,
        imagePermissions: 2,
        woodPerms: 0,
      },
    };
    console.log("procurar perm");
    const member = message.member;
    const memberRolesIds =
      member?.roles.cache.map((role) => role.id).reverse() || [];
    if (memberRolesIds) {
      let highestPermission;
      for (const roleId of memberRolesIds) {
        highestPermission = perms[roleId];
        if (highestPermission) {
          break;
        }
      }
      if (highestPermission) {
        console.log("tem perm");
        const userTrack = await this.panelaRepository.findOne({
          where: {
            guildId: guildId,
            userId: member?.id,
          },
        });
        if (userTrack) {
          console.log("ta na db");
          const permImgLimit = highestPermission.imagePermissions;
          if (userTrack.imagePerms) {
            if (user?.roles.cache.has(permImgRole.id)) {
              console.log("tem imgperm ja");
              if (userTrack.imagePerms.includes(user.id)) {
                console.log("e seu imgperm removendo");
                //remove perm img from user and the db
                await user.roles.remove(permImgRole);
                const newImgPerms = userTrack.imagePerms.filter(
                  (imagePerms) => {
                    return imagePerms !== user.id;
                  }
                );
                await this.panelaRepository.save({
                  ...userTrack,
                  imagePerms: newImgPerms,
                });
                const embed = new EmbedBuilder()
                  .setTitle(`Panela de ${message.author.username}`)
                  .setColor(0xff0000)
                  .setDescription(
                    `**Você removeu a Permissão de foto de ${user}**`
                  );
                return await message.channel
                  .send({ embeds: [embed] })
                  .then((msg) => {
                    setTimeout(() => msg.delete(), 10000);
                  });
              } else {
                console.log("n e seu perm foto fds");
                return;
              }
            }
            console.log(userTrack.imagePerms.length, permImgLimit);
            if (userTrack.imagePerms.length < permImgLimit) {
              console.log("oi");
              const embed = new EmbedBuilder()
                .setTitle(`Panela de ${message.author.username}`)
                .setColor(0x0000ff)
                .setDescription(
                  `**Permissão de foto de ${message.author} adicionado á ${user}!**`
                );
              let newPermImg = userTrack.imagePerms;
              newPermImg.push(user.id);
              await this.panelaRepository.save({
                ...userTrack,
                imagePerms: newPermImg,
              });
              await user?.roles.add(permImgRole);
              console.log("adicionado permImg");
              await message.channel.send({ embeds: [embed] }).then((msg) => {
                setTimeout(() => msg.delete(), 10000);
              });
            } else {
              const embed = new EmbedBuilder()
                .setTitle(`Panela de ${message.author.username}`)
                .setColor(0xff0000)
                .setDescription(
                  `**Seu limite de Permissão de Imagem está atingindo sua capacidade máxima. Para liberar espaço, por favor, utilize o comando 'hs!imgperm' em um de seus Perm de Foto para removê-lo**`
                );
              await message.channel.send({ embeds: [embed] }).then((msg) => {
                setTimeout(() => msg.delete(), 10000);
              });
            }
          }
        } else {
          const save = this.panelaRepository.create({
            guildId: message.guild?.id,
            userId: message.author.id,
          });
          await this.panelaRepository.save(save);
        }
      }
    }
  }
}
