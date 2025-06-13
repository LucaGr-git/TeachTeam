import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity()
export class TutorApplication {
  @PrimaryColumn({ type: "varchar", length: 10})
  courseCode: string;

  @PrimaryColumn({ type: "varchar", length: 40})
  tutorEmail: string;

  @Column({type: "boolean"})
  isLabAssistant: boolean;
  

  @ManyToOne(() => Course)
  @JoinColumn({name: 'courseCode'})
  course: Course;

  @ManyToOne(() => User)
  @JoinColumn({name: 'tutorEmail'})
  tutor: User;
}
