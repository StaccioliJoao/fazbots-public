import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guilds_instagram" })
export class GuildsInstagram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "channel_id" })
  channelId: string;

  @Column({ name: "post_id", unique: true })
  postId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "like_count" })
  likeCount: number;

  @Column({ name: "like_users", array: true, type: "text" })
  likeUsers: string[];

  @Column({ name: "comments", array: true, type: "text" })
  comments: string[];
}
