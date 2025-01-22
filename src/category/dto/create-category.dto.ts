import { InputJsonValue } from '@prisma/client/runtime/library';
import { IsString, IsOptional, isString, IsJSON, IsInt } from 'class-validator';

export class CreateCategoryDto {


  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  locale: string;

  @IsInt()
  level: number;

  @IsOptional()
  @IsString()
  chatPrompt?: string;

  @IsOptional()
  @IsString()
  imageName?: string;

  @IsString()
  parentId: string;

}
