import {
  IsString,
  IsOptional,
  Length,
  IsDateString,
} from 'class-validator';

export class UpdateExperienceDTO {
  @IsString()
  @IsOptional()
  @Length(1, 40)
  title?: string;

  @IsString()
  @IsOptional()
  @Length(1, 40)
  company?: string;

  @IsString()
  @IsOptional()
  @Length(1, 40)
  @IsDateString()
  timeStarted?: string;

  @IsString()
  @IsOptional()
  @Length(1, 40)
  @IsDateString()
  timeFinished?: string;
}
