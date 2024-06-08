import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudinaryService } from 'src/cloudinary/cloduinary.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService, PrismaService],
})
export class ProductModule {}
