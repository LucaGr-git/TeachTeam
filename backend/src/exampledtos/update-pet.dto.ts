import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class UpdatePetDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
