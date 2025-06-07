import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Experience } from './Experience';
import { Skill } from './Skill';
import { Qualification } from './Qualification';

@Entity()
export class User {
  @PrimaryColumn({ type: "varchar", length: 40 })
  email: string;

  @Column({ type: "varchar", length: 40 })
  password: string;

  @Column({ type: "varchar", length: 40 })
  firstName: string;

  @Column({ type: "varchar", length: 40 })
  lastName: string;

  @Column({ type: "boolean" })
  isLecturer: boolean;

  @Column({ type: "boolean" })
  fullTime: boolean;

  @OneToMany(() => Experience, exp => exp.user)
  experiences: Experience[];

  @OneToMany(() => Skill, skill => skill.user)
  skills: Skill[];

  @OneToMany(() => Qualification, qual => qual.user)
  qualifications: Qualification[];
}
