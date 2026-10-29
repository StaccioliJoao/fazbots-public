import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "guilds_migrar" })
export class GuildsMigrar {
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
