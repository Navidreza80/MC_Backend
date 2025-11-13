import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GameDto {

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    title: string;


    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    description: string;
}
