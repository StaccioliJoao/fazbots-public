import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_influencers_posts" })
export class GuildInfluencers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "post_id" })
  postId: string;

  @Column({ name: "likes" })
  likes: number;

  @Column({ name: "like_users", array: true, type: "text" })
  likeUsers: string[];
}
