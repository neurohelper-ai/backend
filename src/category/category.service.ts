import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { equal } from 'assert';
import { equals } from 'class-validator';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
      },
    });
  }

  async update(createCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id: createCategoryDto.id },
      data: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
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


}
