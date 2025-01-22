import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { equal } from 'assert';
import { equals } from 'class-validator';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(category: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        key: category._id,
        locale: category.locale,
        level: category.level,
        name: category.name,
        description: category.description,
        chatPrompt: category.chatPrompt,
        imageName: category.imageName,
        parentId: category.parentId,
      },
    });
  }

  async update(createCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id: createCategoryDto.id },
      data: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
        key: createCategoryDto.key,
        scenario: {
          connect: createCategoryDto.scenarios.map((id) => ({ id })),
        },
      },
    });
  }

  async getCategoryByParent(parentId: string) {
    return await this.prisma.category.findMany({
      where: {
        parentId: parentId,
      },
    });
  }

  async getTopCategories() {
    const categories = await this.prisma.category.findMany({
      where: {
        key:"en1.",
      },
    });

  console.log('Top categories:', categories); 
  return categories;
  }


  async getCategoriesByParentId(parentId: string) {
    return await this.prisma.category.findMany({
      where: { parentId }, 
      orderBy: { name: 'asc' },
    });
  }
  
}
