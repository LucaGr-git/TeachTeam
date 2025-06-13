import { IsEmail, IsString } from "class-validator";

export class CreateQualificationDTO {  
  @IsString() 
  qualification: string;
}