import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HikesModule } from './hikes/hikes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './users/middleware/current-user.middleware';
import { RegionModule } from './region/region.module';
import { TypeOrmConfigService } from 'typeorm.config.service';

@Module({
  imports: [
    UsersModule,
    HikesModule, 
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }), 
    BookingsModule, 
    AuthModule, 
    RegionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'auth', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}