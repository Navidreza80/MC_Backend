import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateScoreDto {

    @IsString()
    @IsNotEmpty()
    score: string;
}
