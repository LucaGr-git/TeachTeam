import { IsEmail, IsInt, IsString, Min } from "class-validator";


export class CreateLecturerShortlistDTO {
  @IsString() 
  courseCode: string;
  
  @IsString() 
  @IsEmail() 
  lecturerEmail: string;
  
  @IsString() 
  @IsEmail() 
  tutorEmail: string;
  
  @IsInt() 
  @Min(1) 
  rank: number;
}