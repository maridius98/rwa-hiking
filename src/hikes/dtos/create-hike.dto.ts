import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateHikeDto {
    @IsNotEmpty()
    @MinLength(4)
    name: string;
  
    @IsOptional()
    description: string;
  
    @IsNotEmpty()
    difficulty: string;
  
    @IsNotEmpty()
    distance: number;
  
    @IsNotEmpty()
    elevationGain: number;
  
    @IsNotEmpty()
    date: Date;
};