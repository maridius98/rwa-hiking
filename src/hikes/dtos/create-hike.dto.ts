import { IsDateString, IsNotEmpty, IsOptional, IsPositive, MinLength } from "class-validator";

export class CreateHikeDto {
    @IsNotEmpty()
    @MinLength(4)
    name: string;
  
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsPositive()
    regionId: number;
    
    @IsPositive()
    @IsNotEmpty()
    distance: number;
  
    @IsPositive()
    @IsNotEmpty()
    elevationGain: number;

    @IsPositive()
    @IsNotEmpty()
    travelCost: number;
  
    @IsNotEmpty()
    @IsDateString()
    date: string | Date;
};