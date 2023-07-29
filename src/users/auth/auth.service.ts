import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from "util";
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../users.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersService } from '../users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService
    ){};

    async register(dto: CreateUserDto) {
        const validatedUser = await this.validateUser(dto);
        let user;
        if (!(validatedUser instanceof UpdateUserDto)){
            user = await this.userService.create(validatedUser);
        }
        return user;
    }

    async validateUser(user: UpdateUserDto | CreateUserDto | User){
        if (await this.userService.findOne(user.email)){
            throw new BadRequestException('email in use');
        }
        if (await this.userService.findOneByUsername(user.username)){
            throw new BadRequestException('Username taken');
        }
        if (user.password){
        const hashedPassword = await this.hashNewPassword(user.password);
        user.password = hashedPassword;
        }
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.userService.findOne(email).select('+password').populate('personalPlans');
        if (!user){
            throw new NotFoundException("User not found");
        }
        console.log(user);
        const [salt] = user.password.split('.', 1);
        const passwordHash = await this.hashPassword(password, salt);
        if (passwordHash !== user.password)
            throw new BadRequestException('Incorrect password');
        return user;
    }

    private async hashPassword(password: string, salt: string){
        const hash = (await scrypt(password, salt, 24)) as Buffer;
        password = salt + '.' + hash.toString('hex');
        return password; 
    }

    private async hashNewPassword(password: string){
        const salt = randomBytes(8).toString('hex');
        return this.hashPassword(password, salt);
    }
}
