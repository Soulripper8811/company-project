// id          String @id @unique @default(uuid())
//   name        String
//   description String
//   products Product[]
//   subCategories SubCategories[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
}
