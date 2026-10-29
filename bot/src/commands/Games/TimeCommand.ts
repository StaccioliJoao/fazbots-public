import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  EmbedBuilder,
  Message,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";
import { GuildsTeams } from "../../typeorm/entities/GuildTeams";
import { ArrayContains } from "typeorm";

export default class TimeCommand extends BaseCommand {
  constructor(
    private readonly guildsTeamsRepository = AppDataSource.getRepository(
      GuildsTeams
    )
  ) {
    super("team", "Games", ["equipe", "time", "t"]);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const member = message.member;
    const guildId = message.guild?.id;
    //check if user has a team and then if they have a team if they are the leader
    const userTeam = await this.guildsTeamsRepository.findOne({
      where: {
        teamMembers: ArrayContains([member?.id]),
      },
    });
    const userHasTeam = userTeam ? true : false;
    if (userHasTeam) {
      const game = userTeam!.game;
      const gameName = game?.replace("_team", "");
      //capitalize first letter of game name
      const gameNameCapitalized =
        gameName?.charAt(0).toUpperCase() + gameName?.slice(1);
      if (userTeam?.userId === member?.id) {
        //user is the leader
        //show team info with buttons to add or remove members
        const teamMembers = userTeam?.teamMembers;
        if (teamMembers) {
          //add <@ to the beginning and > to the end of each id
          const teamMembersMention = teamMembers.map((memberId) => {
            return `・ <@${memberId}>\n`;
          });
          const teamMembersString = teamMembersMention.join("");
          const teamEmbed = new EmbedBuilder()
            .setDescription(
              `**Time:** ${userTeam.teamName}\n**Membros:**\n${teamMembersString}`
            )
            .setFooter({
              text: "Utilize os botões abaixo para manipular o time.",
            })
            .setAuthor({ name: `Jogo: ${gameNameCapitalized}` })
            .setColor("#0000ff")
            .setThumbnail(userTeam.teamLogo);
          const row = new ActionRowBuilder<ButtonBuilder>();
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`team_remove_member-${message.member?.id}`)
              .setLabel("Remover Membro")
              .setStyle(ButtonStyle.Secondary)
          );
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`team_add_member-${message.member?.id}`)
              .setLabel("Adicionar Membro")
              .setStyle(ButtonStyle.Secondary)
          );
          const row2 = new ActionRowBuilder<ButtonBuilder>();
          row2.addComponents(
            new ButtonBuilder()
              .setCustomId(`change_logo-${message.member?.id}`)
              .setLabel("Alterar Foto do Time")
              .setStyle(ButtonStyle.Secondary)
          );
          row2.addComponents(
            new ButtonBuilder()
              .setCustomId(`change_name-${message.member?.id}`)
              .setLabel("Alterar Nome do Time")
              .setStyle(ButtonStyle.Secondary)
          );
          try {
            await message.channel
              .send({ embeds: [teamEmbed], components: [row, row2] })
              .then((msg) => {
                setTimeout(() => msg.delete(), 15000);
              });
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        //user is not the leader
        //show team info with button to leave the team
        //convert the game name to a readable string
        const game = userTeam?.game;
        const gameName = game?.replace("_team", "");
        if (userTeam?.userId !== member?.id) {
          const teamMembers = userTeam?.teamMembers;
          if (teamMembers) {
            //add <@ to the beginning and > to the end of each id
            const teamMembersMention = teamMembers.map((memberId) => {
              return `・ <@${memberId}>\n`;
            });
            const teamMembersString = teamMembersMention.join("");
            const teamEmbed = new EmbedBuilder()
              .setDescription(
                `**Time:** ${userTeam.teamName}\n**Membros:**\n ${teamMembersString}`
              )
              .setAuthor({ name: `Jogo: ${gameNameCapitalized}` })
              .setColor("#0000ff")
              .setThumbnail(userTeam.teamLogo);
            const row = new ActionRowBuilder<ButtonBuilder>();
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `team_leave-${userTeam.userId}-${message.author.id}`
                )
                .setLabel("Sair do time")
                .setStyle(ButtonStyle.Danger)
            );
            try {
              await message.channel
                .send({ embeds: [teamEmbed], components: [row] })
                .then((msg) => {
                  setTimeout(() => msg.delete(), 15000);
                });
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    }
  }
}
