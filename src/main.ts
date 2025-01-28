import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
     new ValidationPipe({
       transform: true,
       whitelist: true,
       forbidNonWhitelisted: true,
     }),
   );

   // Swagger Configuration
   const config = new DocumentBuilder()
     .setTitle('E-Commerce Product API')
     .setDescription('Product management API')
     .setVersion('1.0')
     .addTag('products')
     .addBearerAuth()
     .build();

   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api/docs', app, document);
   
   const port = Number(process.env.PORT || 3000);
   await app.listen(port, () => {
    Logger.debug(`listening on port ${port}`);
  });
}
bootstrap();
