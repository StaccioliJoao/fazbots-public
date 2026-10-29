import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RegisterLog } from "../types";
@Entity({ name: "guild_register_counter" })
export class GuildsRegisterCounter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: "guild_id" })
  guildId: string;

  @Column("jsonb", { name: "register_count" })
  registerCount: RegisterLog[];
}
