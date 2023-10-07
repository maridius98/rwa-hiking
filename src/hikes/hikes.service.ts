import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHikeDto } from './dtos/create-hike.dto';
import { Repository } from 'typeorm';
import { Hike } from './hikes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EditHikeDto } from './dtos/edit-hike.dto';
import { RegionService } from 'src/region/region.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';

@Injectable()
export class HikesService {
    constructor(
        @InjectRepository(Hike)
        private readonly repo: Repository<Hike>,
        private readonly regionService: RegionService,
        private readonly userService: UsersService
    ) {}
    
    async createHike(dto: CreateHikeDto, req: UserToken){
        const guide = await this.userService.findUserById(req.id);
        const region = await this.regionService.findRegion(dto.regionId);
        if (!guide.regions.includes(region)){
            throw new UnauthorizedException(`You cannot host a hike without being assigned to the region`);
        }
        const hike = new Hike();
        Object.assign(hike, dto);
        hike.region = region;
        hike.guide = guide;
        return await this.repo.save(hike);
    }

    async editHike(id: number, dto: EditHikeDto){
        const existingHike = this.getHike(id);
        const newHike = {...existingHike, ...dto};
        return await this.repo.save({...newHike});
    }

    async getHike(id: number){
        const hike = await this.repo.findOneBy({id});
        if (!hike){
            throw new NotFoundException("Hike doesn't exist");
        }
        return hike;
    }

    async verifyIsDue(hike: Hike){
        if (hike.isDue){
            throw new BadRequestException("You cannot interact with due hikes");
        }
    }

    async deleteHike(id: number){
        await this.repo.delete(id);
        return true;
    }
}
