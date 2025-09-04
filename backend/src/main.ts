import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { formatValidationErrors } from './common/validation/validation.messages';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow cookies if needed
  });

  // Global prefix (good practice for APIs)
  app.setGlobalPrefix('api');

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw error if unknown properties
      transform: true, // auto transform DTOs
      exceptionFactory: (validationErrors) => {
        const messages = formatValidationErrors(validationErrors);
        const message = messages[0] || 'Invalid input.';
        return new (require('@nestjs/common').BadRequestException)(message);
      },
    }),
  );

  // Global exception filter to standardize error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
