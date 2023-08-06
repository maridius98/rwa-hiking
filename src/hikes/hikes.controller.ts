import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { HikesService } from './hikes.service';
import { CreateHikeDto } from './dtos/create-hike.dto';
import { GuideGuard } from 'src/users/guards/guide.guard';
import { EditHikeDto } from './dtos/edit-hike.dto';

@UseGuards(GuideGuard)
@Controller('hikes')
export class HikesController {
    constructor(
        private readonly hikesService: HikesService,
    ) {}

    @Post('/create')
    async createHike(@Body() dto: CreateHikeDto) {
        const hike = await this.hikesService.createHike(dto);
        return hike;
    }

    @Put('/:id')
    async editHike(@Body() dto: EditHikeDto, @Param() id: number){
        const hike = await this.hikesService.editHike(id, dto);
        return hike;   
    }

    @Get('/:id')
    async getHike(@Param() id: number) {
        const hike = await this.hikesService.getHike(id);
        return hike;
    }

    @Delete('/:id')
    async deleteHike(@Param() id: number): Promise<boolean>{
        const success: boolean = await this.hikesService.deleteHike(id);
        return success;
    }
    
}
