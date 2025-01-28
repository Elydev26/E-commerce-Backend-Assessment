import { Module } from '@nestjs/common';
import { AppService } from './service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../config/database/db.config';
import { AppController } from './controller/app.controller';
import { ApiModule } from 'src/api/api.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ApiModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,  
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
