import { Column, Entity, ManyToOne } from "typeorm";
import { Common } from "../../common/entities/common";

@Entity("configs")
export class Configs extends Common {
  @Column("int")
  public rank: number;

  @Column("timestamp")
  public from: Date;

  @Column("timestamp")
  public to: Date;

  @Column("varchar")
  public studyProgram: string;
}
