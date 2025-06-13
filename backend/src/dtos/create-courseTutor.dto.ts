import { IsEmail, IsString, Length } from 'class-validator';

export class CreateCourseTutorDTO {
  @IsString()
  @Length(1, 10)
  courseCode: string;

  @IsEmail()
  @Length(1, 40)
  tutorEmail: string;
}
