import { Column, Entity, ManyToOne } from "typeorm";
import { Common } from "../../common/entities/common";
import { Diploma } from "../../diploma/entities/diploma.entity";

export const CONTROL_STATUS = {
  PENDING: "Ne pritje",
  REFUSED: "Refuzuar",
  ACCEPTED: "Pranuar",
  OPEN: "Hapur",
  CLOSED: "Mbyllur",
};
@Entity("controls")
export class Control extends Common {
  @Column("text", {
    nullable: true,
  })
  public status: string;

  @Column("timestamp", {
    nullable: true,
  })
  public sentDate: Date;

  @Column()
  public rank: number;

  @Column("number")
  public diplomaId: number;

  @Column("text", {
    nullable: false,
  })
  public title: string;

  @Column("varchar", {
    nullable: false,
    length: 256,
    name: "document",
  })
  public document: string;

  @Column("text", {
    nullable: false,
  })
  public originalDocument: string;

  @Column("varchar", {
    nullable: false,
  })
  public studyProgram: string;

  @Column()
  public from: number;

  @Column()
  public to: number;

  @ManyToOne(() => Diploma, (diploma) => diploma.controls)
  diploma: Diploma;
}
