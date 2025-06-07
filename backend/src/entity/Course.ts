import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, PrimaryColumn} from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class Course {
  @PrimaryColumn({type: "varchar", length:10})
  courseCode: string;

  @Column({type: "varchar", length: 100})
  courseTitle: string;

  @Column({type: Boolean})
  partTimeFriendly: boolean;

  @Column()
  fullTimeFriendly: boolean;
}