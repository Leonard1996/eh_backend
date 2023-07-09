import { Column, Index } from "typeorm";

export abstract class SoftDelete {
  @Column("tinyint", {
    nullable: false,
    width: 1,
    default: () => "'0'",
    name: "ts_deleted",
  })
  @Index()
  public tsDeleted: boolean;
}
