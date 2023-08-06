import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHikeDto } from './dtos/create-hike.dto';
import { Repository } from 'typeorm';
import { Hike } from './hikes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EditHikeDto } from './dtos/edit-hike.dto';

@Injectable()
export class HikesService {
    constructor(
        @InjectRepository(Hike)
        private readonly repo: Repository<Hike>
    ) {}
    
    async createHike(dto: CreateHikeDto){
        return await this.repo.save({...dto});
    }

    async editHike(id: number, dto: EditHikeDto){
        const existingHike = await this.repo.findOneBy({id});
        if (!existingHike) {
            throw new NotFoundException("Hike doesn't exist");
        }
        const newHike = {...existingHike, ...dto};
        return await this.repo.save({...newHike});
    }

    async getHike(id: number){
        await this.repo.findOneBy({id});
    }

    async deleteHike(id: number){
        await this.repo.delete(id);
        return true;
    }
}
