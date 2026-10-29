import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "influencers_instagram" })
export class InfluencerInstagram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "instagram_handle" })
  instagramHandle: string;

  @Column({ name: "verified_by" })
  verifiedBy: string;

  @Column({ name: "latest_posts", array: true, type: "text" })
  latestPosts: string[];
}
