import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UnauthorizedException, UseGuards, Query } from '@nestjs/common';
import { HikesService } from './hikes.service';
import { CreateHikeDto } from './dtos/create-hike.dto';
import { GuideGuard } from 'src/users/guards/guide.guard';
import { EditHikeDto } from './dtos/edit-hike.dto';

@Controller('hikes')
export class HikesController {
    constructor(
        private readonly hikesService: HikesService,
    ) {}

    @UseGuards(GuideGuard)
    @Post('/create')
    async createHike(@Body() dto: CreateHikeDto, @Request() req: UserToken) {
        const hike = await this.hikesService.createHike(dto, req);
        return hike;
    }

    @UseGuards(GuideGuard)
    @Put('/:id')
    async editHike(@Body() dto: EditHikeDto, @Param() id: number){
        const hike = await this.hikesService.editHike(id, dto);
        return hike;   
    }

    @UseGuards(GuideGuard)
    @Delete('/:id')
    async deleteHike(@Param() id: number): Promise<boolean>{
        const success: boolean = await this.hikesService.deleteHike(id);
        return success;
    }

    @Get('/filterHikes')
    async filterHikes(@Query() query: string){
        const hikes = this.hikesService.filterHikes(query);
        return hikes;
    }

    @Get('/:id')
    async getHike(@Param() id: number) {
        const hike = await this.hikesService.getHike(id);
        return hike;
    }
    
}
