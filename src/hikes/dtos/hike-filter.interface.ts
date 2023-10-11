export class HikeParams {
    search?: string;
    difficulty?: string;
    distance?: string;
    elevationGain?: string;
    sort?: string;
    region?: string;
    
    constructor(params: URLSearchParams){
        this.search = params.get("search");
        this.difficulty = params.get("difficulty");
        this.distance = params.get("distance");
        this.elevationGain = params.get("elevationGain");
        this.sort = params.get("sort");
        this.region = params.get("region");
    }
}

//hikes?search=testing101&distance=GT_10000.LT_20000&elevationGain=LT_800&travelCost=LT_4000&difficulty=Medium&sort=travelCost_desc
