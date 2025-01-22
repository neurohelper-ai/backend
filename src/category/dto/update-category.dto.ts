import { InputJsonValue } from '@prisma/client/runtime/library';
import { IsString, IsOptional, IsArray, IsJSON } from 'class-validator';

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

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
