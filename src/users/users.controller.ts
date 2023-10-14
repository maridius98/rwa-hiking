import { Body, Controller, ExecutionContext, Get, Post, Req, Request } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { TokenHolder } from 'src/token/token-holder.interface';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}
        
    @Get('/loggeduser')
    async WhoAmI(@Request() req: TokenHolder){
        const user = req.user;
        console.log(await this.usersService.findUserById(user.id));
    }
}
