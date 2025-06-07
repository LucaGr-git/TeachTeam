import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateSkillDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  skill: string;
}
