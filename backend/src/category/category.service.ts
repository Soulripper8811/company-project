import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService,) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name, description } = createCategoryDto;
      const category = this.prisma.category.create({
        data: {
          name,
          description,
        },
      });
      return category;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { name, description } = updateCategoryDto;
      const category = await this.prisma.category.findUnique({
        where: {
          id,
        },
      });
      if (!category) {
        throw new HttpException(
          { message: 'No such category is present' },
          HttpStatus.NOT_FOUND,
        );
      }
      const updatecategory = await this.prisma.category.update({
        where: { id: category.id },
        data: {
          name,
          description,
        },
      });
      return updatecategory;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: string) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
  async getAllSubcatgory(id: string) {
    try {
      // const allsub=await this.prisma.subCategories.aggregate({where})
      const allsub = await this.prisma.subCategories.findMany({
        where: {
          categoryId: id,
        },
      });
      if (!allsub) {
        throw new HttpException(
          { message: 'No such category is present' },
          HttpStatus.NOT_FOUND,
        );
      }
      const length = allsub.length;
      return {
        length,
        allsub,
      };
    } catch (error) {
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
