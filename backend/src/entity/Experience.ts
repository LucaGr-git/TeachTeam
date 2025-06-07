import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.experiences)
  user: User;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  timeStarted: string;

  @Column({ nullable: true })
  timeFinished: string;
}
