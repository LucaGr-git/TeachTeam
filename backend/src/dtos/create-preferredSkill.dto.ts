import { IsString, Length } from 'class-validator';

export class CreatePreferredSkillDTO {
  @IsString()
  @Length(1, 10)
  courseCode: string;

  @IsString()
  @Length(1, 40)
  skill: string;
}
