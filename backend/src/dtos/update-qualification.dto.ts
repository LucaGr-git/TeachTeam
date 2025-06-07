import { IsEmail, IsString } from "class-validator";

export class UpdateQualificationDTO {
  @IsString()
  @IsEmail() 
  email: string;
  
  @IsString() 
  oldQualification: string;
  
  @IsString() 
  newQualification: string;
}3