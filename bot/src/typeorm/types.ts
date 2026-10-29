export type PdPerm = {
  id: string;
  limit: number;
};

export type PdUser = {
  userId: string;
  userName: string;
  avatar?: string;
  since: number;
};

export type Lavagem = {
  quantidade: number;
  porcentagem: string;
};

export type RegisterLog = {
  day: string;
  amount: number;
};

export type userPd = {
  guildId: string;
  userId: string;
  pdList: PdUser[];
};

export type ActiveMemberDb = {
  guildId: string;
  userId: string;
  msgCount: number;
  status: string;
  userName: string;
  avatar?: string;
};

export type VerifiedMemberDb = {
  guildId: string;
  userId: string;
  verifierId: string;
  verifierName: string;
  avatar?: string;
  username: string;
};

export type Week = {
  week: number;
  message_count: number;
};
