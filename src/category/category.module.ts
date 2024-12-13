import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScenarioService } from 'src/scenario/scenario.service';

@Module({
  providers: [CategoryService, PrismaService, ScenarioService],
  controllers: [CategoryController],
})
export class CategoryModule {}
