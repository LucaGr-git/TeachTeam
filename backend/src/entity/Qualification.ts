import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Qualification {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @ManyToOne(() => User, user => user.qualifications)
  user: User;

  @Column({ type: "varchar", length: 40 })
  qualification: string;
}
