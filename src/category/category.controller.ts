import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @Post('create')
  addChild(
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch('update')
  updateChild(
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Get()
  getCategoryByParent(
    @Param('parentId') parentId: string
  ) {
    if (!parentId) {
      parentId = '';
    }
    return this.categoryService.getCategoryByParent(parentId);
  }
}
