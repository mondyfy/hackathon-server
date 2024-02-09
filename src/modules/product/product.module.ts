import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CategoryModule } from '../category/category.module';
import { MailModule } from '../mail/mail.module';
import { UploadModule } from '../upload/upload.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/models/product.entity';

@Module({
  imports: [
    NestjsFormDataModule,
    UserModule,
    CategoryModule,
    UploadModule,
    TypeOrmModule.forFeature([Product]),
    MailModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
