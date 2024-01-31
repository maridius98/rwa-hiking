import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHikeDto } from './dtos/create-hike.dto';
import { Repository } from 'typeorm';
import { Hike } from './hikes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EditHikeDto } from './dtos/edit-hike.dto';
import { RegionService } from 'src/region/region.service';
import { UsersService } from 'src/users/users.service'; 
import { HikeParams} from './dtos/hike-filter.interface';
import { QueryParams } from './dtos/query-params.interface';

@Injectable()
export class HikesService {
    constructor(
        @InjectRepository(Hike)
        private readonly repo: Repository<Hike>,
        private readonly regionService: RegionService,
        private readonly userService: UsersService
    ) {}

    private readonly extremeDifficultyThreshold = 15000000;
    private readonly hardDifficultyThreshold = 10000000;
    private readonly mediumDifficultyThreshold = 5000000;

    calculateDifficulty(hike: Hike) {
        const difficultyFactor = hike.distance * hike.elevationGain;
        if (difficultyFactor > this.extremeDifficultyThreshold) {
            return "Extreme";
        }
        else if (difficultyFactor > this.hardDifficultyThreshold){
            return "Hard";
        }
        else if (difficultyFactor > this.mediumDifficultyThreshold){
            return "Medium";
        }
        else {
            return "Easy";
        }
    }
    
    async createHike(dto: CreateHikeDto, guideId: number){
        const guide = await this.userService.findGuideById(guideId);
        const region = await this.regionService.findRegion(dto.regionId);
        const hasRegion = guide.regions.filter(p => p.id == region.id);
        if (hasRegion.length == 0){
            throw new UnauthorizedException(`You cannot host a hike without being assigned to the region`);
        }
        dto.date = new Date(dto.date);
        const hike = this.repo.create(dto);
        hike.region = region;
        hike.guide = guide;
        return await this.repo.save(hike);
    }

    async editHike(hikeId: number, dto: EditHikeDto, guideId: number){
        await this.verifyHikeOfGuide(guideId, hikeId);
        const existingHike = await this.getHike(hikeId);
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

    async verifyHikeOfGuide(guideId: number, hikeId: number) {
        const hike = await this.repo.findOne({
            where: {
                id: hikeId,
                guide: {id: guideId}
                }
            });
        if (!hike){
            throw new UnauthorizedException("Guide didn't host this hike");
        }
    }

    async filterHikes(queryString: string){
        console.log(queryString);
        const params = this.parseQueryString(queryString);
        let query = this.repo.createQueryBuilder("hike");
        if (params.difficulty){
            query = query.andWhere("hike.difficulty = :difficulty", {difficulty: params.difficulty});
        }

        if (params.distance){
            const parsedParameterList = this.parseComparisonFilter(params.distance);
            query = query.andWhere(`hike.distance ${parsedParameterList[0].queryOperator} :distanceOne`, {distanceOne: parsedParameterList[0].queryValue});
            if (parsedParameterList.length==2) {
                query = query.andWhere(`hike.distance ${parsedParameterList[1].queryOperator} :distanceTwo`, {distanceTwo: parsedParameterList[1].queryValue});
            }
        }

        if (params.elevationGain) {
            const parsedParameterList = this.parseComparisonFilter(params.elevationGain);
            query = query.andWhere(`hike.elevationGain ${parsedParameterList[0].queryOperator} :elevationGainOne`, {elevationGainOne: parsedParameterList[0].queryValue});
            if (parsedParameterList.length==2) {
                query = query.andWhere(`hike.elevationGain ${parsedParameterList[1].queryOperator} :elevationGainTwo`, {elevationGainTwo: parsedParameterList[1].queryValue});
            }
        }

        if (params.search){
            query = query.andWhere("hike.name like :name", {name: `%${params.search}%`});
        }

        if (params.sort){
            const [field, order] = params.sort.split('_');
            query = query.orderBy(`hike.${field}`, this.parseSqlOrderBy(order));
        }

        if (params.region){
            query = query.andWhere("hike.region = :region", {region: params.region});
        }
        const hikes = await query.getMany();
        return hikes;
    }

    async verifyIsDue(hike: Hike){
        if (hike.isDue){
            throw new BadRequestException("You cannot interact with due hikes");
        }
    }

    async deleteHike(hikeId: number, guideId: number){
        await this.verifyHikeOfGuide(guideId, hikeId);
        await this.repo.delete(hikeId);
        return true;
    }

    parseComparisonFilter(comparisonParameter: string){
        const distanceParams = comparisonParameter.split('.');
        const queryParamsList: QueryParams[] = [];
        distanceParams.forEach(param => {
            const [operator, value] = param.split('_');
            if (!Number(value)){
                throw new BadRequestException(`Value of ${value} is not a number`);
            }
            if (+value < 0){
                throw new BadRequestException(`Value of ${value} must be a positive integer`);
            }
            const sqlOperator = this.parseSqlOperator(operator);
            const queryParams: QueryParams = {
                queryOperator: sqlOperator,
                queryValue: +value
            } 
            queryParamsList.push(queryParams);
        });
        return queryParamsList;
    }

    parseQueryString(query: string){
        const params = new URLSearchParams(query);
        return new HikeParams(params);
    }

    parseSqlOperator(operator: string): string{
        if (operator === 'GT'){
            return '>';
        }
        if (operator === 'LT'){
            return '<'
        }
        else {
            throw new BadRequestException(`Invalid comparison operator ${operator}`);
        }
    }

    parseSqlOrderBy(orderByString: string){
        if (orderByString === 'DESC' || orderByString === 'ASC') {
            return orderByString;
        }
        else {
            throw new BadRequestException(`Invalid orderBy parameter ${orderByString}`)
        }
    }
}
