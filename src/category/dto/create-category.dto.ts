import { InputJsonValue } from '@prisma/client/runtime/library';
import { IsString, IsOptional, isString, IsJSON } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsJSON()
  translations?: InputJsonValue;
}
