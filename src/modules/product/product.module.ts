import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [NestjsFormDataModule, UserModule, CategoryModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
