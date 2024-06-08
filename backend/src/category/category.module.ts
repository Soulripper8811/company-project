import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloduinary.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService,CloudinaryService],
})
export class CategoryModule {}
