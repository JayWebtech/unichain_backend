import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io'; // Import IoAdapter


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for HTTP requests
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your front-end URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Use the Socket.IO adapter for WebSockets
  app.useWebSocketAdapter(new IoAdapter(app));


  // Enable global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe());
  

// async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();