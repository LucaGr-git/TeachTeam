import { IsBoolean, IsOptional, IsString } from "class-validator";



export class UpdateUserDTO {
  @IsOptional() 
  @IsString() 
  password?: string;
  
  @IsOptional() 
  @IsString() 
  firstName?: string;
  
  @IsOptional() 
  @IsString() 
  lastName?: string;
  
  @IsOptional() 
  @IsBoolean() 
  fullTime?: boolean;
}