import { Module } from '@nestjs/common';
import { HikesController } from './hikes.controller';
import { HikesService } from './hikes.service';
import { Hike } from './hikes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Hike])],
  controllers: [HikesController],
  providers: [HikesService]
})
export class HikesModule {}
