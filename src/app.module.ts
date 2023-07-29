import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HikesModule } from './hikes/hikes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [UsersModule, HikesModule, TypeOrmModule.forRoot(typeOrmConfig), BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
