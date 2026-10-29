import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_coins" })
export class GuildCoins {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "coins", type: "bigint" })
  coins: number;

  @Column({ name: "msg_count", type: "bigint" })
  msgCount: number;

  @Column({ name: "join_time", nullable: true, type: "timestamp" })
  joinTime: Date;

  @Column({ name: "daily_time", nullable: true, type: "timestamp" })
  dailyTime: Date;

  @Column({ name: "cooldown", nullable: true, type: "timestamp" })
  cooldown: Date;

  @Column({ name: "married_to", nullable: true, type: "text" })
  marriedTo: string | null;

  @Column({ name: "married_at", nullable: true, type: "bigint" })
  marriedAt: number | null;
  @Column({
    name: "stars",
    type: "bigint",
    default: 0,
  })
  stars: number;
}
