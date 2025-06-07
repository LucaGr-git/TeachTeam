import { IsEmail, IsString, Length } from 'class-validator';

export class CreateCourseLecturerDTO {
  @IsString()
  @Length(1, 10)
  courseCode: string;

  @IsEmail()
  @Length(1, 40)
  lecturerEmail: string;
}
