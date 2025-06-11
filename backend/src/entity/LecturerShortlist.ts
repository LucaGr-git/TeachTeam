import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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
  @JoinColumn({name: 'courseCode'})
  course: Course;

  @ManyToOne(() => User)
  @JoinColumn({name: 'lecturerEmail'})
  lecturer: User;

  @ManyToOne(() => User)
  @JoinColumn({name: 'tutorEmail'})
  tutor: User;
}
