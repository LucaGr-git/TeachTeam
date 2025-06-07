import { IsEmail, IsInt, IsString, Min } from "class-validator";


export class UpdateLecturerShortlistDTO {
  @IsInt() 
  @Min(1) 
  rank?: number;
}