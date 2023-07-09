import { Column, Entity, OneToMany } from "typeorm";
import { Common } from "../../common/entities/common";
import { Diploma } from "../../diploma/entities/diploma.entity";
import { Notification } from "../../notification/entity/notification.entity";

export enum Roles {
  STUDENT = "student",
  TEACHER = "teacher",
}

@Entity("users")
export class User extends Common {
  @Column("varchar", {
    nullable: false,
    length: 256,
    name: "name",
  })
  public name: string;

  @Column("varchar", {
    nullable: false,
    length: 256,
    name: "email",
  })
  public email: string;

  @Column("varchar", {
    nullable: false,
    length: 256,
    name: "unique_name",
  })
  public uniqueName: string;

  @Column("varchar", {
    nullable: true,
    length: 256,
  })
  public uniqueNumber: string;

  @Column("varchar", {
    nullable: false,
    length: 256,
    name: "role",
    default: Roles.STUDENT,
  })
  public role: string;

  @OneToMany(() => Diploma, (diploma) => diploma.student)
  diplomasAsStudent: Diploma[];

  @OneToMany(() => Diploma, (diploma) => diploma.teacher)
  diplomasAsTeacher: Diploma[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  public toResponseObject = () => {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      tsCreated: this.tsCreated,
      tsLastModified: this.tsLastModified,
    };
  };
}
