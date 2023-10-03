import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { Repository } from 'typeorm';
import { HikesService } from 'src/hikes/hikes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private readonly repo: Repository<Booking>,
        private readonly hikeService: HikesService,
        private readonly userService: UsersService
    ){};

    async createBooking(dto: CreateBookingDto, hikeId: number, userId: number){
        
    }
}
