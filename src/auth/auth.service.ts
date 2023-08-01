import { Injectable, Inject, forwardRef, BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from "util";
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ){};

    async register(dto: CreateUserDto) {
        await this.validateUser(dto.email, dto.username)
        dto.password = await this.hashNewPassword(dto.password);
        const user = await this.userService.createUser(dto);
        const payload = { sub: user.id, username: user.username};
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async logout(){
        
    }

    async validateUser(email: string, username: string){
        if (await this.userService.findUserByEmail(email)){
            throw new BadRequestException('Email in use');
        }
        if (await this.userService.findUserByUsername(username)){
            throw new BadRequestException('Username taken');
        }
    }

    async login(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);
        if (!user){
            throw new NotFoundException("User not found");
        }
        console.log(user);
        this.validatePassword(password, user.password);
        const payload = { sub: user.id, username: user.username};
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    private async validatePassword(inputPassword: string, databasePassword: string){
        const [salt] = databasePassword.split('.', 1);
        const passwordHash = await this.hashPassword(inputPassword, salt);
        if (passwordHash !== databasePassword){
            throw new BadRequestException('Incorrect password');
        }
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
