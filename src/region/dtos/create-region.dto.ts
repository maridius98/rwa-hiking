import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  NUTS: string;

  @IsOptional()
  areas: string[];
}