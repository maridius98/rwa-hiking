import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HikesModule } from './hikes/hikes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, HikesModule, TypeOrmModule.forRoot(typeOrmConfig), BookingsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
