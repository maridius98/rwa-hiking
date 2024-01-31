import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startUp } from './app.startup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  startUp(app);
  await app.listen(3000);
}
bootstrap();
