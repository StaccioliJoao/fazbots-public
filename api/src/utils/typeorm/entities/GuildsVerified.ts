import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guilds_verified' })
export class GuildsVerified {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'guild_id' })
  guildId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'verifier_id' })
  verifierId: string;

  @Column({ name: 'verifier_name' })
  verifierName: string;

  @Column({ name: 'avatar' })
  userAvatar?: string;
}
