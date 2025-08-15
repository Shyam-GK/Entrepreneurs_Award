import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for your React frontend
  app.enableCors({
    origin: 'http://localhost:5173', // React app URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'Uploads'), { prefix: '/uploads/' }); // Serve files from Uploads
  // Enable class-validator globally
  app.useGlobalPipes(new ValidationPipe());

  // Start server
  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
  console.log(`📂 Uploads accessible at http://localhost:3000/uploads`);
}
bootstrap();