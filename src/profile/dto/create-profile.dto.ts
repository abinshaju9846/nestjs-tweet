import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateProfileDto {
    @IsInt()
    @Type(() => Number)
    user_id: number
    @IsOptional()
    @IsString()
    bio?: string
    @IsOptional()
    avatar?: string|null

}
