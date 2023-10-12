import { Allow, IsNotEmptyObject } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Region } from "src/region/region.entity";

export class CreateGuideDto extends CreateUserDto {
    @Allow()
    regions: number[] | Region[] = [];
}