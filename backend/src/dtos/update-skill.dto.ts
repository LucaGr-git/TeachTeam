import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateSkillDTO {
  @IsString()
  @IsOptional()
  @Length(1, 40)
  skill?: string;
}
