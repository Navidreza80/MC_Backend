import { IsString, MinLength } from 'class-validator';

export class RegisterDto {

    @IsString()
    @MinLength(6)
    username: string;


    @IsString()
    @MinLength(6)
    password: string;

}
