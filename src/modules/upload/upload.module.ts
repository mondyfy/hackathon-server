import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService, CloudinaryProvider]
})
export class UploadModule {}
