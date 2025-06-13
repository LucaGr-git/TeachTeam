import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity()
export class ShortlistNote {
  @PrimaryGeneratedColumn({ type: "int"})
  id: number;

  @ManyToOne(() => Course)
  @JoinColumn({name: 'courseCode'})
  course: Course;

  @ManyToOne(() => User)
  @JoinColumn({name: 'lecturerEmail'})
  lecturer: User;

  @ManyToOne(() => User)
  @JoinColumn({name: 'tutorEmail'})
  tutor: User;

  @Column({ type: "varchar", length: 100})
  message: string;

  @Column({ type: "varchar", length: 100}) // todo think about date typing (it is curently an ISO Sstring))
  date: string;
}
