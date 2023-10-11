import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHikeDto } from './dtos/create-hike.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Hike } from './hikes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EditHikeDto } from './dtos/edit-hike.dto';
import { RegionService } from 'src/region/region.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
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

    calculateDifficulty(hike: Hike) : string{
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

    async filterHikes(queryString: string){
        const params = this.parseQueryString(queryString);
        let query = this.repo.createQueryBuilder("hike");

        if (params.difficulty){
            query = query.andWhere("hike.difficulty = :difficulty", {difficulty: params.difficulty});
        }

        if (params.distance){
            const parsedParameterList = this.parseComparisonFilter(params.distance);
            parsedParameterList.forEach(p => {
                query = query.andWhere(p.queryString, {distance: p.queryValue});
            })
        }

        if (params.elevationGain) {
            const parsedParameterList = this.parseComparisonFilter(params.elevationGain);
            parsedParameterList.forEach(p => {
                query = query.andWhere(p.queryString, {elevationGain: p.queryValue});
            })
        }

        if (params.search){
            query = query.andWhere("hike.name like :name", {name: `%${params.search}`});
        }

        if (params.sort){
            const [field, order] = params.sort.split('_');
            query = query.orderBy(`hike.${field}`, this.SQLOrderByParse(order));
        }

        if (params.region){
            query = query.andWhere("hike.region = :region", {region: params.region});
        }

        const hikes = await query.limit(10).getMany();

        return hikes;
    }

    parseSortFilter(sortParameter: string){
  
        
    }


    parseComparisonFilter(comparisonParameter: string){
        const [field] = comparisonParameter.split('_', 1);
        const distanceParams = comparisonParameter.split('.');
        const queryParamsList: QueryParams[] = [];
        distanceParams.forEach(param => {
            const [operator, value] = param.split('_');
            const sqlOperator = this.SQLOperatorParse(operator);
            const queryParams: QueryParams = {
                queryString: `hike.${field} ${sqlOperator} :value`,
                queryValue: value
            } 
            queryParamsList.push(queryParams);
        });
        return queryParamsList;
    }

    SQLOrderByParse(orderByString: string){
        if (orderByString === 'DESC')
            return 'DESC'
        return 'ASC';
    }

    parseQueryString(query: string){
        const params = new URLSearchParams(query);
        return new HikeParams(params);
        // const difficultyParams = hikeParams.difficulty.split('.', 2);
        // difficultyParams.forEach(param => {
        //     const [field, operator, value] = param.split('_');
        //     const sqlOperator = this.SQLOperatorParse(operator);
        // })
        // const [field, operator, value] = hikeParams.
    }

    SQLOperatorParse(operator: string): string{
        if (operator === 'GT'){
            return '>';
        }
        if (operator === 'LT'){
            return '<'
        }
        return '=';
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
