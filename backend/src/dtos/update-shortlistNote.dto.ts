import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateShortlistNoteDTO {
  @IsOptional() 
  @IsString() 
  message?: string;
  
  @IsOptional() 
  @IsDateString() 
  date?: string;
}
