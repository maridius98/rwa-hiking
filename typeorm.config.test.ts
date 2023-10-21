import { Booking } from "src/bookings/bookings.entity";
import { Hike } from "src/hikes/hikes.entity";
import { Region } from "src/region/region.entity";
import { User } from "src/users/users.entity";
import { DataSourceOptions } from "typeorm";

export const typeOrmConfigTest: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mypassword',
    database: 'hiking_test_db',
    entities: [User, Booking, Hike, Region],
    synchronize: true
}