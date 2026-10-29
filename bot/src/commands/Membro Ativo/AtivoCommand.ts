import { EmbedBuilder, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsActiveMembers } from "../../typeorm/entities/GuildsActiveMembers";

export default class AtivoCommand extends BaseCommand {
  constructor(
    private readonly activeRepository = AppDataSource.getRepository(
      GuildsActiveMembers
    )
  ) {
    super("ativo", "Membro Ativo", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    const [memberId, ...rest] = args;
    if (
      message.member?.roles.cache.some((role) =>
        config?.activeMemberPerms.includes(role.id)
      )
    ) {
      const user = await client.users.fetch(
        memberId.replace("<@", "").replace(">", "")
      )!;
      const activeMember = message.guild?.members.cache.get(user.id);
      if (activeMember?.roles.cache.hasAny(...config!.activeMemberRole)) {
        try {
          const userTrack = await this.activeRepository.findOne({
            where: {
              guildId: message.guildId!,
              userId: activeMember.id,
            },
          });
          await this.activeRepository.save({
            ...userTrack,
            status: "removed",
          });
          await activeMember.roles.remove(config!.activeMemberRole);
          const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`**Membro ativo de ${activeMember} removido!**`);
          return message.channel
            .send({ embeds: [errorEmbed] })
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            })
            .catch((err) => console.log(err));
        } catch (err) {
          console.log("membro ativo - comando remover", err);
        }
      } else {
        try {
          const updatedAvatar = activeMember!.user.avatar || "";

          const userTrack = await this.activeRepository.findOne({
            where: {
              guildId: message.guildId!,
              userId: activeMember!.id,
            },
          });
          await this.activeRepository.save({
            ...userTrack,
            userId: activeMember?.id,
            guildId: message.guildId!,
            msgCount: config?.activeMemberGoal,
            avatar: updatedAvatar,
            username: activeMember!.user.tag,
            status: "set",
          });
          await activeMember!.roles.add(config!.activeMemberRole);
          const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`**Membro ativo adicionado em ${activeMember}!**`);
          return message.channel
            .send({ embeds: [errorEmbed] })
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            })
            .catch((err) => console.log(err));
        } catch (err) {
          console.log("membro ativo - comando adicionar", err);
        }
      }
    }
  }
}
