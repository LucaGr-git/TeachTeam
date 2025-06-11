import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity()
export class ShortlistedTutor {
  @PrimaryColumn({ type: "varchar", length: 10})
  courseCode: string;

  @PrimaryColumn({ type: "varchar", length: 40})
  tutorEmail: string;

  @ManyToOne(() => Course)
  @JoinColumn({name: 'courseCode'})
  course: Course;

  @ManyToOne(() => User)
  @JoinColumn({name: 'tutorEmail'})
  tutor: User;
}
