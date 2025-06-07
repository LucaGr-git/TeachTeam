import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Experience } from './Experience';
import { Skill } from './Skill';
import { Qualification } from './Qualification';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isLecturer: boolean;

  @Column()
  fullTime: boolean;

  @OneToMany(() => Experience, exp => exp.user)
  experiences: Experience[];

  @OneToMany(() => Skill, skill => skill.user)
  skills: Skill[];

  @OneToMany(() => Qualification, qual => qual.user)
  qualifications: Qualification[];
}
