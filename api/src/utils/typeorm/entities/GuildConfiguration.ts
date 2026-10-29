import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PdPerm } from '../../types';

@Entity({ name: 'guild_configuration' })
export class GuildConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'guild_id' })
  guildId: string;

  @Column({ unique: true, name: 'bot_id' })
  botId: string;

  @Column({ unique: true, name: 'bot_token', update: false })
  botToken: string;

  @Column({ default: '!' })
  prefix: string;

  @Column({ name: 'welcome_channel_id', nullable: true })
  welcomeChannelId: string;

  @Column({ name: 'welcome_channel_message', nullable: true })
  welcomeChannelMessage: string;

  @Column({ name: 'instagram_channel_id', nullable: true })
  instagramChannelId: string;

  @Column({ name: 'migrar_channel_id', nullable: true })
  migrarChannelId: string;

  @Column({ name: 'migrar_channel_text', nullable: true })
  migrarChannelText: string;

  @Column({ name: 'migrar_channel_img', nullable: true })
  migrarChannelImg: string;

  @Column({ name: 'migrar_roles', nullable: true, array: true, type: 'text' })
  migrarRoles: string[];

  @Column({ name: 'migrar_embed_color', nullable: true })
  migrarColor: string;

  @Column({ name: 'register_channel_id', nullable: true })
  registerChannelId: string;

  @Column({ name: 'register_channel_text', nullable: true })
  registerChannelText: string;

  @Column({ name: 'register_channel_img', nullable: true })
  registerChannelImg: string;

  @Column({ name: 'register_embed_color', nullable: true })
  registerColor: string;

  @Column({ name: 'male_role', nullable: true })
  registerMale: string;

  @Column({ name: 'female_role', nullable: true })
  registerFemale: string;

  @Column({ name: 'over_role', nullable: true })
  registerOver: string;

  @Column({ name: 'under_role', nullable: true })
  registerUnder: string;

  @Column({ name: 'randomgifs_channel_id', nullable: true })
  randomgifsChannelId: string;

  @Column({ name: 'randomicons_channel_id', nullable: true })
  randomiconsChannelId: string;

  @Column({ name: 'voicecount_channel_id', nullable: true })
  voicecountChannelId: string;

  @Column({ name: 'banlog_channel_id', nullable: true })
  banLogChannelId: string;

  @Column({ name: 'kicklog_channel_id', nullable: true })
  kickLogChannelId: string;

  @Column({ name: 'mutelog_channel_id', nullable: true })
  muteLogChannelId: string;

  @Column({ name: 'entrylog_channel_id', nullable: true })
  entryLogChannelId: string;

  @Column({ name: 'ban_perm_roles', array: true, nullable: true, type: 'text' })
  banPermRoles: string[];

  @Column({
    name: 'mute_perm_roles',
    array: true,
    nullable: true,
    type: 'text',
  })
  mutePermRoles: string[];

  @Column({
    name: 'kick_perm_roles',
    array: true,
    nullable: true,
    type: 'text',
  })
  kickPermRoles: string[];

  @Column({ name: 'pd_role', nullable: true })
  pdRole: string;

  @Column('jsonb', { name: 'pd_perms', nullable: true })
  pdPerms: PdPerm[];

  @Column({ name: 'perm_site', nullable: true })
  permSite: string;

  @Column({ name: 'owner_id', nullable: true })
  ownerId: string;

  @Column({ name: 'mute_role', nullable: true })
  muteRole: string;

  @Column({ name: 'voice_count_msg', nullable: true })
  voiceCountMsg: string;

  @Column({ name: 'member_count_channel_id', nullable: true })
  memberCountId: string;

  @Column({ name: 'member_count_msg', nullable: true })
  memberCountMsg: string;

  @Column({
    name: 'member_count_emojis',
    array: true,
    nullable: true,
    type: 'text',
  })
  memberCountEmojis: string[];

  @Column({
    name: 'active_member_roles',
    nullable: true,
    array: true,
    type: 'text',
  })
  activeMemberRole: string[];

  @Column({
    name: 'active_member_perms',
    nullable: true,
    array: true,
    type: 'text',
  })
  activeMemberPerms: string[];

  @Column({ name: 'active_member_msg', nullable: true })
  activeMemberMsg: string;

  @Column({ name: 'active_member_color', nullable: true })
  activeMemberColor: string;

  @Column({ name: 'active_member_toggle', nullable: true })
  activeMemberToggle: boolean;

  @Column({ name: 'active_member_goal', nullable: true })
  activeMemberGoal: number;

  @Column({ name: 'verified_log_channel', nullable: true })
  verifiedLogChannel: string;

  @Column({ name: 'verifier_role', nullable: true })
  verifierRole: string;

  @Column({ name: 'verified_role', nullable: true })
  verifiedRole: string;

  @Column({ name: 'tellonym_post_channel', nullable: true })
  tellonymPostChannel: string;

  @Column({ name: 'tellonym_create_channel', nullable: true })
  tellonymCreateChannel: string;

  @Column({ name: 'tellonym_vote_channel', nullable: true })
  tellonymVoteChannel: string;

  @Column({ name: 'tellonym_roles', nullable: true, array: true, type: 'text' })
  tellonymRoles: string[];

  @Column({ name: 'tellonym_text', nullable: true })
  tellonymText: string;

  @Column({ name: 'tellonym_img', nullable: true })
  tellonymImg: string;

  @Column({ name: 'tellonym_limit', nullable: true })
  tellonymLimit: number;

  @Column({ name: 'tellonym_color', nullable: true })
  tellonymColors: string;

  @Column({ name: 'url_protection_toggle', nullable: true })
  urlProtectionToggle: boolean;

  @Column({ name: 'url_protection_vanity', nullable: true })
  urlProtectionVanity: string;

  @Column({ name: 'sejamembro_channel', nullable: true })
  sejaMembroChannel: string;

  @Column({
    name: 'sejamembro_roles',
    nullable: true,
    array: true,
    type: 'text',
  })
  sejaMembroRoles: string[];

  @Column({
    name: 'sejamembro_verify',
    nullable: true,
    array: true,
    type: 'text',
  })
  sejaMembroVerify: string[];

  @Column({ name: 'sejamembro_color', nullable: true })
  sejaMembroColor: string;

  @Column({ name: 'sejamembro_text', nullable: true })
  sejaMembroText: string;

  @Column({ name: 'sejamembro_img', nullable: true })
  sejaMembroImg: string;

  @Column({ name: 'deaf_toggle', nullable: true })
  deafToggle: boolean;

  @Column({ name: 'mute_toggle', nullable: true })
  muteToggle: boolean;

  @Column({
    name: 'hour_counter_roles',
    nullable: true,
    array: true,
    type: 'text',
  })
  hourCounterRoles: string[];

  @Column({
    name: 'hour_counter_perms',
    nullable: true,
    array: true,
    type: 'text',
  })
  hourCounterPerms: string[];

  @Column({
    name: 'hour_counter_categories',
    nullable: true,
    array: true,
    type: 'text',
  })
  counterCategories: string[];

  @Column({ name: 'like_emoji', nullable: true })
  likeEmoji: string;

  @Column({ name: 'comment_emoji', nullable: true })
  commentEmoji: string;

  @Column({ name: 'view_like_emoji', nullable: true })
  viewLikeEmoji: string;

  @Column({ name: 'view_comment_emoji', nullable: true })
  viewCommentEmoji: string;
  
  @Column({
    name: 'influencer_perm',
    nullable: true,
    array: true,
    type: 'text',
  })
  influencerPerm: string[];

  @Column({ name: 'influencer_role', nullable: true })
  influencerRole: string;

  @Column({ name: 'influencer_painel', nullable: true })
  influencerPainel: string;

  @Column({ name: 'influencer_instagram_channel', nullable: true })
  influencerInstaChannel: string;
}
