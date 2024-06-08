import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CloudinaryService } from './cloudinary/cloduinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ProductModule,
    CategoryModule,
    SubcategoryModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService, CloudinaryService],
})
export class AppModule {}
