import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GuideGuard } from 'src/users/guards/guide.guard';
import { CreateRegionDto } from './dtos/create-region.dto';
import { RegionService } from './region.service';

@UseGuards(GuideGuard)
@Controller('region')
export class RegionController {
    constructor(private readonly regionService: RegionService){}

    @Post('/create')
    async createRegion(@Body() dto: CreateRegionDto){
        this.regionService.createRegion(dto);
    }
}
