import { INestApplication } from "@nestjs/common";
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

export function startUp(app: INestApplication){
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
}