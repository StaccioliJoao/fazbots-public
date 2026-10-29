import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PdUser } from "../types";

@Entity({ name: "guilds_panela" })
export class GuildsPanela {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({
    name: "antbans",
    nullable: true,
    array: true,
    type: "text",
    default: {},
  })
  antBans: string[];

  @Column({
    name: "lady_goldens",
    nullable: true,
    array: true,
    type: "text",
    default: {},
  })
  ladyGoldens: string[];

  @Column({
    name: "image_perms",
    nullable: true,
    array: true,
    type: "text",
    default: {},
  })
  imagePerms: string[];

  @Column({
    name: "wood_perms",
    nullable: true,
    array: true,
    type: "text",
    default: {},
  })
  woodPerms: string[];
}
