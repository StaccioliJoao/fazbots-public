import { PdUser } from '../../types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guilds_pd' })
export class GuildsPd {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'guild_id' })
  guildId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column('jsonb', { name: 'pd_list' })
  pdList: PdUser[];
}
