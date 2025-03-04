import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    role: string;
}
