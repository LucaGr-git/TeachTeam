import { IsEmail, IsOptional, IsString } from "class-validator";



export class UpdateShortlistedTutorDTO {
  @IsString()
  @IsEmail()
  tutorEmail: string;
}