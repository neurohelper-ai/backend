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
        // key: createCategoryDto.key,
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

  async getTopCategories(locale: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        locale: locale,
        // key: {
        //   in: ["en1.", "es1.", "pt1." ,"it1.", "de1.", "fr1.", "ru1.", "tr1.", "id1.", "zh1.", "jp1.", "ko1." ],
        // },
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
