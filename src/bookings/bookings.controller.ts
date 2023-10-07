import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { GuideGuard } from 'src/users/guards/guide.guard';

@Controller('bookings')
export class BookingsController {
    constructor(
        private readonly bookingService: BookingsService
    ){};

    @Post('/create/:isPaid')
    async createBooking(@Param() isPaid: boolean,  @Param() hikeId: number, @Request() user: UserToken){
        const booking = await this.bookingService.createBooking(isPaid, hikeId, user.id);
        return booking;
    }

    @UseGuards(GuideGuard)
    @Get('/:hikeId')
    async getBookingsOnHike(@Param() hikeId: number){
        const bookings = await this.bookingService.getBookingsOnHike(hikeId);
        return bookings;
    }

    @Put('/:bookingId')
    async payBooking(@Param() bookingId: number, @Request() user: UserToken){
        const booking = await this.bookingService.payBooking(user.id, bookingId);
        return booking;
    }

    @Delete('/:bookingId')
    async removeBooking(@Param() bookingId: number, @Request() user: UserToken){
        await this.bookingService.removeBooking(bookingId, user.id);
        return; 
    }

}
