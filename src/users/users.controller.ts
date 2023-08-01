import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}
    
    @Post('/register')
    async createUser(@Body() dto: CreateUserDto){
        const user = await this.authService.register(dto);
        return user;
    }
}
