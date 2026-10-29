import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guilds_teams" })
export class GuildsTeams {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "team_name" })
  teamName: string;

  @Column({ name: "game" })
  game: string;

  @Column({ name: "team_members", array: true, type: "text" })
  teamMembers: string[];

  @Column({
    name: "team_logo",
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png",
  })
  teamLogo: string;
}
