import { IsBoolean, IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { IsString } from "class-validator";

export class CreateCourseDTO {
    @IsString()
    @Length(8, 10)
    @IsNotEmpty()
    courseCode: string;

    @IsString()
    @IsNotEmpty()
    courseTitle: string;

    @IsBoolean()
    @IsNotEmpty()
    partTimeFriendly: boolean;

    @IsBoolean()
    @IsNotEmpty()
    fullTimeFriendly: boolean;

}
