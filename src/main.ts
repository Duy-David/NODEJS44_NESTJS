import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// declare const module: any;
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  //add validation
  app.useGlobalPipes(new ValidationPipe());
  const configSwagger = new DocumentBuilder()
    .setTitle('API Youtube')
    .setDescription('Danh sách API Youtube ')
    .setVersion('1.0')
    .addBearerAuth()
    .build(); //builder partern
  const swagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('swagger', app, swagger);
  const port = configService.get<number>('PORT') || 8081;
  await app.listen(port);

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
