import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthguardGuard } from './auth/authguard.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.useGlobalGuards(new AuthguardGuard());
}
bootstrap();
