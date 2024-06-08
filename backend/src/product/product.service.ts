import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloduinary.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(image: Express.Multer.File, createProductdto: CreateProductDto) {
    const uploadResult = await this.cloudinary.uploadImage(image);
    return this.prisma.product.create({
      data: {
        ...createProductdto,
        sellingPrice: Number(createProductdto.sellingPrice),
        actualPrice: Number(createProductdto.actualPrice),
        bannerImage: uploadResult.secure_url,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({});
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    Image?: Express.Multer.File,
  ) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new HttpException('no such product', HttpStatus.NOT_FOUND);
      }
      const updateData = { ...updateProductDto };
      if (updateProductDto.sellingPrice !== undefined) {
        updateData.sellingPrice = Number(updateProductDto.sellingPrice);
      }
      if (updateProductDto.actualPrice !== undefined) {
        updateData.actualPrice = Number(updateProductDto.actualPrice);
      }
      if (Image) {
        const currentImageUrl = product.bannerImage;
        const publicId = this.getCloudinaryPublicId(currentImageUrl);
        if (publicId) {
          await this.cloudinary.deleteImage(publicId);
        }
        const uploadResult = await this.cloudinary.uploadImage(Image);
        updateData.bannerImage = uploadResult.secure_url;
      }
      return this.prisma.product.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id,
        },
      });
      if (!product) {
        throw new HttpException('no such product', HttpStatus.NOT_FOUND);
      }
      if (product.bannerImage) {
        const currentImageUrl = product.bannerImage;
        const publicId = await this.getCloudinaryPublicId(currentImageUrl);
        await this.cloudinary.deleteImage(publicId);
      }
      return this.prisma.product.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  private getCloudinaryPublicId(url: string): string | null {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0]; // Removing file extension
    return publicId || null;
  }
}
