import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateProfileDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;
}
