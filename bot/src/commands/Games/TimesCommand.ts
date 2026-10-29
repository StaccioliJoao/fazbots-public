import { EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { GuildsTeams } from "../../typeorm/entities/GuildTeams";
import { AppDataSource } from "../../typeorm/dataSource/dataSource";

export default class TimesCommand extends BaseCommand {
  constructor(
    private readonly guildsTeamsRepository = AppDataSource.getRepository(
      GuildsTeams
    )
  ) {
    super("times", "Games", []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
      const guildTeams = await this.guildsTeamsRepository.find({
        where: {
          guildId: message.guild?.id,
        },
      });
      if (guildTeams.length > 0) {
        let Valorant_teams: GuildsTeams[] = [];
        let Brawlhalla_teams: GuildsTeams[] = [];
        let LoL_teams: GuildsTeams[] = [];
        let Freefire_teams: GuildsTeams[] = [];
        for (const team of guildTeams) {
          if (team.game === "Valorant_team") {
            console.log(team);
            Valorant_teams.push(team);
          }
          if (team.game === "Brawlhalla_team") {
            Brawlhalla_teams.push(team);
          }
          if (team.game === "LoL_team") {
            LoL_teams.push(team);
          }
          if (team.game === "Freefire_team") {
            Freefire_teams.push(team);
          }
        }
        const teamsEmbed = new EmbedBuilder().setTitle("Times - Houst");
        let valorantSection = "";
        Valorant_teams.forEach((team) => {
          const teamMembersMention = team.teamMembers.map((memberId) => {
            return `<@${memberId}> `;
          });
          const teamMembersString = teamMembersMention.join("");
          valorantSection += `**${team.teamName}**: ${teamMembersMention}\n`;
        });
        let brawlhallaSection = "";
        Brawlhalla_teams.forEach((team) => {
          const teamMembersMention = team.teamMembers.map((memberId) => {
            return `<@${memberId}> `;
          });
          const teamMembersString = teamMembersMention.join("");
          brawlhallaSection += `**${team.teamName}**: ${teamMembersMention}\n`;
        });
        let lolSection = "";
        LoL_teams.forEach((team) => {
          const teamMembersMention = team.teamMembers.map((memberId) => {
            return `<@${memberId}> `;
          });
          const teamMembersString = teamMembersMention.join("");
          lolSection += `**${team.teamName}**: ${teamMembersMention}\n`;
        });
        let freefireSection = "";
        Freefire_teams.forEach((team) => {
          const teamMembersMention = team.teamMembers.map((memberId) => {
            return `<@${memberId}> `;
          });
          const teamMembersString = teamMembersMention.join("");
          freefireSection += `**${team.teamName}**: ${teamMembersMention}\n`;
        });
        teamsEmbed.setDescription(`**・ Valorant**:\n${valorantSection}\n 
        **・ Brawlhalla**:\n${brawlhallaSection}\n 
        **・ LoL**:\n${lolSection}\n 
        **・ Freefire**:\n${freefireSection} 
        `);
        teamsEmbed.setColor(0xff0000);
        await message.channel.send({ embeds: [teamsEmbed] });
      }
    }
  }
}
