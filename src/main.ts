import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Ajwain')
    .setDescription('The Ajwain API description')
    .setVersion('1.0')
    .addCookieAuth('token_cookie', {
      type: 'apiKey',
      in: 'cookie',
      name: process.env.JWT_COOKIE_NAME,
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
