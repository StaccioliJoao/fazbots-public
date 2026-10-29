import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guilds_clans" })
export class GuildClans {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "leaders_id", array: true, type: "text" })
  leadersId: string[];

  @Column({ name: "clan_name" })
  clanName: string;

  @Column({ name: "clan_members", array: true, type: "text" })
  clanMembers: string[];

  @Column({ name: "clan_channel", nullable: true })
  clanChannel: string;
}
