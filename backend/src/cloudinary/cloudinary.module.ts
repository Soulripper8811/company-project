import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloduinary.service';

@Module({
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
