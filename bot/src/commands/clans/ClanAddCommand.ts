import {
  EmbedBuilder,
  GuildMember,
  Message,
  PermissionsBitField,
  VoiceChannel,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildClans } from "../../typeorm/entities/GuildClan";
import { ArrayContains } from "typeorm";

export default class ClanAddCommand extends BaseCommand {
  constructor(
    private readonly guildClansRepository = AppDataSource.getRepository(
      GuildClans
    )
  ) {
    super("clanAdd", "clans", ["clanadd"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const clanMember = message.member;
    const member =
      (message.mentions.members?.first() as GuildMember) ||
      (message.guild?.members.cache.get(args[0]) as GuildMember);

    if (clanMember && member) {
      const userLeader = await this.guildClansRepository.findOne({
        where: {
          leadersId: ArrayContains([clanMember.id]),
        },
      });
      const userIsLeader = userLeader ? true : false;
      const userTeam = await this.guildClansRepository.findOne({
        where: {
          clanMembers: ArrayContains([member.id]),
        },
      });
      const userHasTeam = userTeam ? true : false;
      console.log(userIsLeader, userHasTeam);
      if (userIsLeader && !userHasTeam) {
        const clanMembers = userLeader!.clanMembers;
        clanMembers.push(member.id);
        await this.guildClansRepository.save({
          ...userLeader,
          clanMembers: clanMembers,
        });
        const clanChannel = message.guild?.channels.cache.get(
          userLeader?.clanChannel || ""
        ) as VoiceChannel;
        if (clanChannel) {
          await clanChannel.permissionOverwrites.edit(member, {
            Connect: true,
          });
          const embed = new EmbedBuilder()
            .setTitle(`Membro adicionado ao clan!`)
            .setDescription(
              `${member} foi adicionado ao clan ${userLeader?.clanName} com sucesso!`
            )
            .setColor("#00ff00");
          return await message.channel
            .send({ embeds: [embed] })
            .then((msg) => {
              setTimeout(() => msg.delete(), 5000);
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }
}
