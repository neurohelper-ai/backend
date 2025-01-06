import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class ScenarioService {
  constructor(private prisma: PrismaService) {}

  async create(createScenarioDto: CreateScenarioDto) {
    const { categoryId, ...data } = createScenarioDto;

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
    }

    return this.prisma.scenario.create({
      data: {
        ...data,
        categoryId,
      },
    });
  }

  async update(id: string, updateScenarioDto: UpdateScenarioDto) {
    const { categoryId, ...data } = updateScenarioDto;

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
    }

    try {
      return this.prisma.scenario.update({
        where: { id },
        data: {
          ...data,
          categoryId,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Scenario with ID ${id} not found`);
    }
  }

  async findOne(id: string) {
    const scenario = await this.prisma.scenario.findUnique({
      where: { id },
    });
    if (!scenario) {
      throw new NotFoundException(`Scenario with ID ${id} not found`);
    }
    return scenario;
  }

  // для работы со сценариями
  async findAll(categoryId?: string) {

    if (!categoryId) {
      return this.prisma.scenario.findMany();
    }

    return this.prisma.scenario.findMany({
      where: { categoryId },
    });
  }

  async remove(id: string) {
    try {
      return this.prisma.scenario.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Scenario with ID ${id} not found`);
    }
  }
}
