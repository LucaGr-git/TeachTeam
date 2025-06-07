import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Qualification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.qualifications)
  user: User;

  @Column()
  qualification: string;
}
