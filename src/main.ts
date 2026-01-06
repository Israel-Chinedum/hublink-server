import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.log('A request was just made!');
        const firstErrorField = errors[0];
        const message = firstErrorField.constraints
          ? Object.values(firstErrorField.constraints)
          : 'Validation failed!';

        return new BadRequestException(message);
      },
    }),
  );
  app.enableCors();
  const port = 3000;
  await app.listen(process.env.PORT ?? port);
  console.log(`Port ${port} is now active!`);
}
bootstrap();
