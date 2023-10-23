import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import Logging from './library/Logging';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('The Smart Way')
    .setDescription('The Smart Way test API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};

const initValidation = (app: INestApplication) =>
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  initSwagger(app);
  initValidation(app);

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);

  Logging.log(`App is listening on: ${await app.getUrl()}`);
}
bootstrap();
