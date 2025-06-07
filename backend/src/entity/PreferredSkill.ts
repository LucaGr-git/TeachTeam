import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PreferredSkill {
  @PrimaryColumn({ type: "varchar", length: 10})
  courseCode: string;

  @PrimaryColumn({ type: "varchar", length: 40})
  skill: string;
}
