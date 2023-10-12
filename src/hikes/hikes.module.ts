import { Module } from '@nestjs/common';
import { HikesController } from './hikes.controller';
import { HikesService } from './hikes.service';
import { Hike } from './hikes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionModule } from 'src/region/region.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hike]),
    RegionModule,
    UsersModule
  ],
  controllers: [HikesController],
  providers: [HikesService],
  exports: [HikesService]
})
export class HikesModule {}
