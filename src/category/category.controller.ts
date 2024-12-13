import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ScenarioService } from 'src/scenario/scenario.service';

@Controller('category')
// @UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly scenarioService: ScenarioService,
  ) {}

  @Post('create')
  addChild(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch('update')
  updateChild(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Get()
  async getCategoryByParent(@Req() req) {
    let parentId = req.query.parentId;
    if (!parentId) {
      parentId = '';
    }
    let scenario = [];
    const category = await this.categoryService.getCategoryByParent(parentId);
    try {
      scenario = parentId && (await this.scenarioService.findAll(parentId));
    } catch (e) {
      console.log(e);
    }

    return {
      category,
      scenario,
    };
  }
}
