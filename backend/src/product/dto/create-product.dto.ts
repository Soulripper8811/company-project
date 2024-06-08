import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'sellingPrice must be a valid number' },
  )
  @Type(() => Number)
  sellingPrice: number; // Declared as float

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'actualPrice must be a valid number' },
  )
  @Type(() => Number)
  actualPrice: number; // Declared as float

  @IsOptional()
  @IsString()
  @IsUrl()
  bannerImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  Tags: string[];

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
