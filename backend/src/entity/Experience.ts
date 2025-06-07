import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @ManyToOne(() => User, user => user.experiences)
  user: User;

  @Column({ type: "varchar", length: 40 })
  title: string;

  @Column({ type: "varchar", length: 40 })
  company: string;

  @Column({ type: "varchar", length: 40 })
  timeStarted: string;

  @Column({ type: "varchar", length: 40, nullable: true })
  timeFinished: string;
}
