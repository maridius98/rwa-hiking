import { IsNotEmpty, IsOptional, IsPositive, MinLength } from "class-validator";

export class CreateHikeDto {
    @IsNotEmpty()
    @MinLength(4)
    name: string;
  
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsPositive()
    regionId: number;
  
    @IsNotEmpty()
    difficulty: string;
  
    @IsPositive()
    @IsNotEmpty()
    distance: number;
  
    @IsPositive()
    @IsNotEmpty()
    elevationGain: number;
  
    @IsNotEmpty()
    date: Date;
};