import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  fullName: string;

  @IsNotEmpty()
  @MinLength(2)
  username: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsOptional()
  birthDate?: Date;

  @IsOptional()
  gender?: string;

}