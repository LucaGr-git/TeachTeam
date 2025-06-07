import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class CreatePetDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
