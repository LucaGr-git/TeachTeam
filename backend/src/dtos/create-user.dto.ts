import { IsBoolean, IsEmail, IsString, Length, IsNotEmpty } from "class-validator";



export class CreateUserDTO {
  @IsString()
  @IsEmail() 
  email: string;

  @IsString() 
  @Length(6, 100) 
  password: string;
  
  @IsString() 
  firstName: string;
  
  @IsString() 
  lastName: string;
  
  @IsBoolean() 
  isLecturer: boolean;
  
  @IsBoolean() 
  fullTime: boolean;

  @IsString()
  @IsNotEmpty()
  dateJoined: string;

}
