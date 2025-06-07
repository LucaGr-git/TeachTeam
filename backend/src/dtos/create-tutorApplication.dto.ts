import { IsBoolean, IsNotEmpty } from "class-validator";
import { Length, IsEmail } from "class-validator";
import { IsString } from "class-validator";

export class CreateTutorApplicationDTO {
  @IsString() 
  courseCode: string;
  
  @IsString() 
  @IsEmail()
  tutorEmail: string;
}