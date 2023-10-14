import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { GuideGuard } from 'src/users/guards/guide.guard';
import { TokenHolder } from 'src/token/token-holder.interface';

@Controller('bookings')
export class BookingsController {
    constructor(
        private readonly bookingService: BookingsService
    ){};

    @Post('/create/:hikeId/:isPaid')
    async createBooking(@Param("isPaid") isPaid: boolean,  @Param("hikeId") hikeId: number, @Request() req: TokenHolder){
        const booking = await this.bookingService.createBooking(isPaid, hikeId, req.user.id);
        return booking;
    }

    @Get('/mybookings')
    async getMyBookings(@Request() req: TokenHolder){
        const bookings = await this.bookingService.getMyBookings(req.user.id);
        return bookings;
    }

    @UseGuards(GuideGuard)
    @Get('/:hikeId')
    async getBookingsOnHike(@Param() hikeId: number){
        const bookings = await this.bookingService.getBookingsOnHike(hikeId);
        return bookings;
    }

    @Put('/:bookingId')
    async payBooking(@Param() bookingId: number, @Request() req: TokenHolder){
        const booking = await this.bookingService.payBooking(req.user.id, bookingId);
        return booking;
    }

    @Delete('/:bookingId')
    async removeBooking(@Param('bookingId') bookingId: number, @Request() req: TokenHolder){
        await this.bookingService.removeBooking(bookingId, req.user.id);
        return; 
    }

}
