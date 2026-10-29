import { EmbedBuilder, GuildMember, Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsPd } from "../../typeorm/entities/GuildsPd";

export default class ListpdCommand extends BaseCommand {
  constructor(
    private readonly pdRepository = AppDataSource.getRepository(GuildsPd)
  ) {
    super("listpd", "PD", ["pdlist"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const member =
      (message.mentions.members?.first() as GuildMember) ||
      (message.guild?.members.cache.get(args[0]) as GuildMember) ||
      (message.member as GuildMember);
    if (member) {
      const config = client.configs.get(message.guildId!);
      const pdPerms = config?.pdPerms;
      const memberRoles = member.roles.cache;
      const userPdPerms =
        memberRoles
          ?.map((role) => pdPerms?.find((perm) => perm.id === role.id))
          .filter((notUndefined) => notUndefined !== undefined)
          .reverse() || [];
      if (userPdPerms.length > 0) {
        const memberPds = await this.pdRepository.findOne({
          where: {
            guildId: message.guildId!,
            userId: member.id,
          },
        });
        if (!memberPds) {
          const newUserPd = this.pdRepository.create({
            guildId: message.guild?.id,
            userId: member!.id,
            pdList: [],
          });
          await this.pdRepository.save(newUserPd);
        }
        var userDamas;
        const userPdAmount = memberPds?.pdList.length || 0;
        const pdLimit = `${userPdAmount}/${userPdPerms[0]?.limit}`;
        if (userPdAmount > 0) {
          userDamas = memberPds?.pdList.map((pd) => `\n· <@${pd.userId}>`);
        } else {
          userDamas = `\n${member.displayName} não possui PD.`;
        }
        const pdEmbed = new EmbedBuilder()
          .setTitle(
            `<:anel:1019457244422754366> Primeira Dama De ${member?.displayName}`
          )
          .setFooter({ text: `${pdLimit}` })
          .setDescription(`**Damas:**${userDamas}`)
          .setTimestamp()
          .setColor(0xffb4c2)
          .setThumbnail(member.displayAvatarURL());
        await message.channel.send({ embeds: [pdEmbed] }).then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });
      }
    }
  }
}
