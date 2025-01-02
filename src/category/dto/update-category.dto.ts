import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsArray()
  scenarios: string[];
}
