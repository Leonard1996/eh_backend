import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Common } from "../../common/entities/common";
import { User } from "../../user/entities/user.entity";
import { Control } from "../../control/entities/control.entity";

@Entity("diplomas")
export class Diploma extends Common {
  @Column("number")
  public studentId: number;

  @Column("number")
  public teacherId: number;

  @ManyToOne(() => User, (user) => user.diplomasAsStudent)
  student: User;

  @ManyToOne(() => User, (user) => user.diplomasAsTeacher)
  teacher: User;

  @OneToMany(() => Control, (control) => control.diploma)
  controls: Control[];
}
