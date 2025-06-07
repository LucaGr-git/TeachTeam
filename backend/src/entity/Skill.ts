import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @ManyToOne(() => User, user => user.skills)
  user: User;

  @Column({ type: "varchar", length: 40 })
  skill: string;
}
