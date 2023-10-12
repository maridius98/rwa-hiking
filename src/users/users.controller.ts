import { Body, Controller, ExecutionContext, Get, Post, Req, Request } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}
        
    @Get('/loggeduser')
    async WhoAmI(@Request() req){
        const user: UserToken = req.user;
        console.log(await this.usersService.findUserById(user.id));
    }
   // GET http://localhost:3000/users/loggeduser
}
