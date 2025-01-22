import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ScenarioService } from 'src/scenario/scenario.service';

@Controller('category')
// @UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Post('/create')
  addChild(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch('update')
  updateChild(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Get()
  async getCategoryByParent(@Req() req) {
    let parentId = req.query.parentId || '';
    
    const category = await this.categoryService.getCategoryByParent(parentId);
  
    return {
      category,
    };
  }

@Get('top-categories')
  async getTopCategories() {
  return this.categoryService.getTopCategories();
}

@Get('subcategories/:parentId')
  async getCategoriesByParentId(@Param('parentId') parentId: string) {
    return await this.categoryService.getCategoriesByParentId(parentId);
  }
}