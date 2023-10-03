import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';

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

    @Post('/login')
    async login(@Body() dto: LoginUserDto){
        const user = await this.authService.login(dto);
        return user;
    }

    @Post('/guide')
    async createGuide(@Body() dto: CreateUserDto){
        const user = await this.authService.registerGuide(dto);
        return user;
    }
}
