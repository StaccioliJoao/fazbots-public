import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'guilds_active_members' })
export class GuildsActiveMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'guild_id' })
  guildId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'msg_count' })
  msgCount: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'user_name' })
  username: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;
}
