import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_mutes" })
export class GuildMutes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "muted_member_id" })
  mutedMemberID: string;
}
