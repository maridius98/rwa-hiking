import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './region.entity';
import { Repository } from 'typeorm';
import { CreateRegionDto } from './dtos/create-region.dto';

@Injectable()
export class RegionService {
    constructor(
        @InjectRepository(Region)
        private readonly repo: Repository<Region>
    ){};

    async createRegion(dto: CreateRegionDto){
        return this.repo.save(dto);
    }

    async findRegion(id: number){
        const region = await this.repo.findOneBy({id});
        if (!region){
            throw new NotFoundException("Region not found");
        }
        return region;
    }
}
