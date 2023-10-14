import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { Repository } from 'typeorm';
import { HikesService } from 'src/hikes/hikes.service';
import { UsersService } from 'src/users/users.service';
import { Hike } from 'src/hikes/hikes.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private readonly repo: Repository<Booking>,
        private readonly hikeService: HikesService,
        private readonly userService: UsersService
    ){};

    async createBooking(isPaid: boolean, hikeId: number, userId: number){
        const hike = await this.hikeService.getHike(hikeId);
        const user = await this.userService.findUserById(userId);
        const booking = new Booking();
        booking.isPaid = isPaid;
        booking.date = new Date();
        this.hikeService.verifyIsDue(hike);
        booking.hike = hike;
        booking.hiker = user;
        return await this.repo.save(booking);
    }

    async payBooking(userId: number, bookingId: number){
        const booking = await this.getBookingWithUser(bookingId, userId);
        booking.isPaid = true;
        return await this.repo.save(booking);
    }

    async getMyBookings(userId: number){
        const bookings = this.repo.find({
            where: {
                hiker: {id: userId}
            },
            relations: ['hike']
        });
        return bookings;
    }

    async getBookingsOnHike(hikeId: number){
        const bookings = this.repo
        .createQueryBuilder()
        .where('booking.hike = :hikeId', {hikeId})
        .getRawMany();
        return bookings;
    }

    async findBooking(id: number){
        const booking = await this.repo.findOneBy({id});
        if (!booking){
            throw new NotFoundException("Booking doesnt exist");
        }
        return booking;
    }

    async getBookingWithUser(id: number, hikerId: number){
        const booking = this.repo.findOne({
            where : {
                id: id,
                hiker: {id: hikerId}
            }
        });
        if (!booking){
            throw new UnauthorizedException("You are not permitted to access this booking");
        }
        return booking;
    }

    async removeBooking(bookingId: number, userId: number){
        const booking = await this.getBookingWithUser(bookingId, userId);
        this.verifyIsDue(booking);
        this.repo.delete(booking.id);
    }

    async lockBooking(hike: Hike, booking: Booking){
        booking.isDue = hike.isDue;
        this.repo.save(booking);
    }

    private verifyIsDue(booking: Booking){
        if (booking.isDue){
            throw new BadRequestException("You cannot pay or remove due bookings");
        }
    }

}
