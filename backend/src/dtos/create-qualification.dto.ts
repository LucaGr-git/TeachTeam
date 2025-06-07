import { IsEmail, IsString } from "class-validator";

export class CreateQualificationDTO {
  @IsString()
  @IsEmail() 
  email: string;
  
  @IsString() 
  qualification: string;
}