import { IsInt, IsNotEmpty } from "class-validator";

export class CreateLikeDto {
    // @IsInt()
    // @IsNotEmpty()
    // user_id: number;

    @IsInt()
    @IsNotEmpty()
    tweet_id: number;
}