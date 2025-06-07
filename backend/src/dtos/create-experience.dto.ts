import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
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
  timeStarted: string;

  @IsString()
  @IsOptional()
  @Length(1, 40)
  timeFinished?: string;
}
