import { IsOptional, MinLength } from "class-validator";

export class EditHikeDto {
    @IsOptional()
    @MinLength(4)
    name: string;
  
    @IsOptional()
    description: string;
  
    @IsOptional()
    difficulty: string;
  
    @IsOptional()
    distance: number;
  
    @IsOptional()
    elevationGain: number;
  
    @IsOptional()
    date: Date;
};