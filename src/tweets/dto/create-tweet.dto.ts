import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateTweetDto {
    // @IsInt()
    // user_id:number
    @IsNotEmpty()
    @IsString()
    content: string;

}
