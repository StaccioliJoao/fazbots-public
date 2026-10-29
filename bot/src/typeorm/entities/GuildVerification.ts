import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "guilds_verification" })
export class GuildsVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "thread_id" })
  threadId: string;

  @Column({ name: "archived" })
  isArchived: string;
}
