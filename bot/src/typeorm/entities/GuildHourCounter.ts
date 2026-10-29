import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_hour_counter" })
export class GuildHourCounter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "total_time", nullable: true, default: 0 })
  totalTime: number;

  @Column({ name: "join_time", nullable: true, type: "timestamp" })
  joinTime: Date;

  @Column({ name: "leave_time", nullable: true, type: "timestamp" })
  leaveTime: Date;

  @Column({ name: "time_in_role", nullable: true, default: 0 })
  timeInRole: number;

  @Column({ name: "date_role", nullable: true, type: "timestamp" })
  dateRole: Date;

  @Column({ name: "counter_role_id", nullable: true })
  roleId: string;
}
