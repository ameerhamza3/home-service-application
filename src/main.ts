import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const port = process.env.PORT || 3000;
  console.log(`Server is listening on port ${port}`);

}
bootstrap();
