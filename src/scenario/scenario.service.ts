import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { Prisma } from '@prisma/client';
const slugify = require('slugify');


@Injectable()
export class ScenarioService {
  constructor(private prisma: PrismaService) {}

  private generateKey(name: string): string{
    return slugify(name, {lower: true, replacement: '_'});
  }

  async create(createScenarioDto: CreateScenarioDto) {
    const { categoryId, name, ...data } = createScenarioDto;

    const key = this.generateKey(name);


    const existingScenario = await this.prisma.scenario.findUnique({where: {key}});
    if(existingScenario){
      throw new Error(`Scenario with key '${key}' already exists. `)
    }


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
        name,
        key,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        
      },
    });
  }

  async update(id: string, updateScenarioDto: UpdateScenarioDto) {
    const { categoryId, name, ...data } = updateScenarioDto;

    let updateData: Prisma.ScenarioUpdateInput = {...data};
    
    if(name){
      updateData.name = name;
      updateData.key = this.generateKey(name);

      const existingScenario = await this.prisma.scenario.findUnique({where: {key: updateData.key as string}});
      if (existingScenario && existingScenario.id !== id){
        throw new Error(`Scenario with key '${updateData.key}' already exists.`);
      }
    }

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      updateData.category = {connect: {id: categoryId}};
    }

    try {
      return this.prisma.scenario.update({
        where: { id },
        data: updateData,
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
