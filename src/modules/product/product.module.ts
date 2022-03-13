import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CategoryModule } from '../category/category.module';
import { UploadModule } from '../upload/upload.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [NestjsFormDataModule, UserModule, CategoryModule, UploadModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
