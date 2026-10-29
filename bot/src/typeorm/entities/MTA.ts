import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Lavagem } from "../types";
@Entity({ name: "mta_cdc" })
export class MTA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  discordId: string;

  @Column({ name: "mta_id" })
  mtaID: string;

  @Column({ name: "channel_id" })
  channelId: string;

  @Column({ name: "total_lavado" })
  totalLavado: number;

  @Column({ name: "total_recebido" })
  totalRecebido: number;

  @Column({ name: "total_contribuido" })
  totalContribuido: number;

  @Column({ name: "a_pagar" })
  aPagar: number;

  @Column("jsonb", { name: "historico_lavagens" })
  historicoLavagens: Lavagem[];
}
