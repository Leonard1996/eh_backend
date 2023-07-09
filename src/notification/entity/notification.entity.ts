import { Column, Entity, ManyToOne } from "typeorm";
import { Common } from "../../common/entities/common";
import { User } from "../../user/entities/user.entity";

@Entity("notifications")
export class Notification extends Common {
  @Column("text", {
    nullable: false,
  })
  public meta: string;

  @Column("number")
  public userId: number;

  @Column("tinyint", {
    default: "0",
  })
  public isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
