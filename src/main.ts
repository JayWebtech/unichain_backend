import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- New import
import { Logger } from '@nestjs/common'; // <-- New import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Reject requests with invalid props
      transform: true,       // Auto-transform payloads to DTO instances
    })
  );

  // Startup logging (non-invasive)
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();