import { Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Course {
  @PrimaryColumn({type: "varchar", length:10})
  courseCode: string;

  @Column({type: "varchar", length: 100})
  courseTitle: string;

  @Column({type: "boolean"})
  partTimeFriendly: boolean;

  @Column({type: "boolean"})
  fullTimeFriendly: boolean;
}