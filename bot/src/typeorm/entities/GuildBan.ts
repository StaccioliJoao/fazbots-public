import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guild_bans' })
export class GuildBanLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'guild_id' })
  guildId: string;

  
  @Column({ name: 'banned_member_id' })
  bannedMemberID: string;

  
  @Column({ name: 'issued_by' })
  issuedBy: string;
  
  @Column({name: 'issued_on'})
  issuedDate: Date;

  @Column()
  reason?: string;

}