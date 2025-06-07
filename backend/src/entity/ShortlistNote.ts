import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity()
export class ShortlistNote {
  @PrimaryGeneratedColumn({ type: "int"})
  id: number;

  @ManyToOne(() => Course)
  course: Course;

  @ManyToOne(() => User)
  lecturer: User;

  @ManyToOne(() => User)
  tutor: User;

  @Column({ type: "varchar", length: 100})
  message: string;

  @Column({ type: "varchar", length: 100}) // todo think about date typing (it is curently an ISO Sstring))
  date: string;
}
