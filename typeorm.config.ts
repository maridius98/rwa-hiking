import { Booking } from "src/bookings/bookings.entity";
import { Hike } from "src/hikes/hikes.entity";
import { User } from "src/users/users.entity";
import { DataSourceOptions } from "typeorm";

export const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mypassword',
    entities: [User, Booking, Hike],
    synchronize: true
}