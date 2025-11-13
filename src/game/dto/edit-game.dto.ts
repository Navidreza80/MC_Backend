import { IsOptional, IsString, MinLength } from 'class-validator';

export class EditGameDto {

    @IsString()
    @MinLength(6)
    @IsOptional()
    title: string;


    @IsString()
    @MinLength(6)
    @IsOptional()
    description: string;
}
