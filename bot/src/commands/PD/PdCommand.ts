import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { PdPerm, PdUser } from "../../typeorm/types";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsPd } from "../../typeorm/entities/GuildsPd";

export default class PdCommand extends BaseCommand {
  constructor(
    private readonly pdRepository = AppDataSource.getRepository(GuildsPd)
  ) {
    super("pd", "PD", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = client.configs.get(message.guildId!);
    const pdPerms = config?.pdPerms;
    const memberRoles = message.member?.roles.cache;
    const userPdPerms =
      memberRoles
        ?.map((role) => pdPerms?.find((perm) => perm.id === role.id))
        .filter((notUndefined) => notUndefined !== undefined)
        .reverse() || [];
    if (userPdPerms.length > 0) {
      var highestPerm = userPdPerms.reduce(function (prev, current) {
        if (+current!.limit > +prev!.limit) {
          return current;
        } else {
          return prev;
        }
      });
      const memberPds = await this.pdRepository.findOne({
        where: {
          guildId: message.guildId!,
          userId: message.member?.id,
        },
      });
      if (!memberPds) {
        const newUserPd = this.pdRepository.create({
          guildId: message.guild?.id,
          userId: message.member!.id,
          pdList: [],
        });
        await this.pdRepository.save(newUserPd);
      }
      var userDamas;
      const userPdAmount = memberPds?.pdList.length || 0;
      const pdLimit = `${userPdAmount}/${highestPerm!.limit}`;
      if (userPdAmount > 0) {
        await message.guild?.members.fetch();
        userDamas = memberPds?.pdList.map(
          (pd) => `\n· <@${pd.userId}> - <t:${Math.round(pd.since / 1000)}:R>`
        );
        let updatedPdList: PdUser[] = [];
        memberPds?.pdList.forEach((pd) => {
          const pdMember = message?.guild?.members.cache.get(pd.userId);
          const updatedAvatar = pdMember!.user.avatar || "";
          const updatedPD = {
            userId: pdMember!.id,
            userName: pdMember!.displayName,
            avatar: updatedAvatar,
            since: pd.since,
          };
          updatedPdList.push(updatedPD);
        });
        await this.pdRepository.save({
          ...memberPds,
          pdList: updatedPdList,
        });
      } else {
        userDamas = `\n${message.member?.displayName} não possui PD.`;
      }
      const row = new ActionRowBuilder<ButtonBuilder>();
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`remove_pd-${message.member?.id}`)
          .setLabel("Remover PD")
          .setStyle(ButtonStyle.Secondary)
      );
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`add_pd-${message.member?.id}`)
          .setLabel("Adicionar PD")
          .setStyle(ButtonStyle.Secondary)
      );
      const pdEmbed = new EmbedBuilder()
        .setTitle(
          `<:anel:1019457244422754366> Primeira Dama De ${message.member?.displayName}`
        )
        .setFooter({ text: `${pdLimit}` })
        .setDescription(`**Damas:**${userDamas}`)
        .setTimestamp()
        .setColor(0xffb4c2)
        .setThumbnail(message.member!.displayAvatarURL());
      await message.channel
        .send({ embeds: [pdEmbed], components: [row] })
        .then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });
    }
  }
}
