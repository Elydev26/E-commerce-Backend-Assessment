import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Product } from 'src/entity/product.entity';
import { Category } from 'src/entity/category.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Category]), UserModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
