import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateProfileDto {
    @IsInt()
    user_id: number
    @IsOptional()
    @IsString()
    bio?: string
    @IsOptional()
    @IsString()
    avatar?: string

}
