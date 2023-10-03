import { ExecutionContext, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>
    ){};

    async findUserByEmail(email: string){
        return this.repo.findOneBy({email});
    }

    async findUserByUsername(username: string){
        return this.repo.findOneBy({username});
    }

    async findUserById(id: number){
        return this.repo.findOneBy({id});
    }

    async createUser(dto: CreateUserDto | UpdateUserDto){
        return await this.repo.save({...dto});
    }
}
