import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity()
export class LecturerShortlist {
  @PrimaryColumn({ type: "varchar", length: 10})
  courseCode: string;

  @PrimaryColumn({ type: "varchar", length: 40})
  lecturerEmail: string;

  @PrimaryColumn({ type: "varchar", length: 40})
  tutorEmail: string;

  @Column({ type: "int"})
  rank: number;

  @ManyToOne(() => Course)
  course: Course;

  @ManyToOne(() => User)
  lecturer: User;

  @ManyToOne(() => User)
  tutor: User;
}
