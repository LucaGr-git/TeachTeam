import { IsEmail, IsString } from "class-validator";



export class CreateShortlistedTutorDTO {
  @IsString() 
  courseCode: string;
  
  @IsString()
  @IsEmail() 
  tutorEmail: string;
}