import { IsDateString, IsEmail, IsString } from "class-validator";

export class CreateShortlistNoteDTO {
  @IsString() 
  courseCode: string;
  
  @IsEmail() 
  tutorEmail: string;
  
  @IsEmail() 
  lecturerEmail: string;
  
  @IsString() 
  message: string;
  

  @IsDateString() 
  date: string;
}
