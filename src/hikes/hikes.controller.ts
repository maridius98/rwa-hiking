import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UnauthorizedException, UseGuards, Query } from '@nestjs/common';
import { HikesService } from './hikes.service';
import { CreateHikeDto } from './dtos/create-hike.dto';
import { GuideGuard } from 'src/users/guards/guide.guard';
import { EditHikeDto } from './dtos/edit-hike.dto';
import { TokenHolder } from 'src/token/token-holder.interface';

@Controller('hikes')
export class HikesController {
    constructor(
        private readonly hikesService: HikesService,
    ) {}

    @UseGuards(GuideGuard)
    @Post('/create')
    async createHike(@Body() dto: CreateHikeDto, @Request() req: TokenHolder) {
        const hike = await this.hikesService.createHike(dto, req.user.id);
        return hike;
    }

    @UseGuards(GuideGuard)
    @Put('/:hikeId')
    async editHike(@Body() dto: EditHikeDto, @Param() hikeId: number, @Request() req: TokenHolder){
        const hike = await this.hikesService.editHike(hikeId, dto, req.user.id);
        return hike;   
    }

    @UseGuards(GuideGuard)
    @Delete('/:hikeId')
    async deleteHike(@Param("hikeId") hikeId: number, @Request() req: TokenHolder): Promise<boolean>{
        const success = await this.hikesService.deleteHike(hikeId, req.user.id);
        return success;
    }

    @Get('/search')
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
