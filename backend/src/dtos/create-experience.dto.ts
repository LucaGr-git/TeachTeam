import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsDateString,
} from 'class-validator';

export class CreateExperienceDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  company: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  @IsDateString()
  timeStarted: string;

  @IsString()
  @IsOptional()
  @Length(1, 40)
  @IsDateString()
  timeFinished?: string;
}
