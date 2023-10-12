import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { HikesModule } from 'src/hikes/hikes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Booking]),
    HikesModule,
    UsersModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
