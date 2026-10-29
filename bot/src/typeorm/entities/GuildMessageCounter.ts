import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Week } from "../types";

@Entity({ name: "guild_message_counter" })
export class GuildMessageCounter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "user_id" })
  userId: string;

  //will be a array of week objects
  @Column("jsonb", { name: "week", nullable: true, default: "[]" })
  week: Week[];

  //role id
  @Column({ name: "role_id", nullable: true })
  roleId: string;
}
