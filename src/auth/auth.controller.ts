import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}
    
    @Post('/register')
    async createUser(@Body() dto: CreateUserDto){
        const user = await this.authService.register(dto);
        return user;
    }
}
