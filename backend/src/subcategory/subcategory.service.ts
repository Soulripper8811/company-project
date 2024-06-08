import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubcategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const { categoryId, name, description } = createSubcategoryDto;

    try {
      // Check if the category exists
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new HttpException(
          'Category not found. You cannot create a subcategory without a valid category.',
          HttpStatus.NOT_FOUND,
        );
      }

      // Create the new subcategory
      const newSubcategory = await this.prisma.subCategories.create({
        data: {
          categoryId: category.id, // Link the subcategory to the existing category
          name,
          description,
        },
      });

      return newSubcategory;
    } catch (error) {
      console.error('Error creating subcategory:', error.message);

      // Handle specific error codes if needed, otherwise default to internal server error
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while creating the subcategory.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll() {
    return this.prisma.subCategories.findMany();
  }

  findOne(id: string) {
    return this.prisma.subCategories.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    try {
      const subcategory = await this.prisma.subCategories.findUnique({
        where: {
          id,
        },
      });
      if (!subcategory) {
        throw new HttpException(
          { message: 'no sub category found' },
          HttpStatus.NOT_FOUND,
        );
      } else {
        const { name, description } = updateSubcategoryDto;
        const newsubcategory = this.prisma.subCategories.create({
          data: {
            name,
            description,
            categoryId: subcategory.categoryId,
          },
        });
        return newsubcategory;
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: string) {
    return this.prisma.subCategories.delete({ where: { id } });
  }
}
