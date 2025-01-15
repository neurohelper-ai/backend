import { PartialType } from '@nestjs/mapped-types';
import { CreateScenarioDto } from './create-scenario.dto';
import { IsOptional, IsString, IsJSON } from 'class-validator';
import { InputJsonValue } from '@prisma/client/runtime/library';

export class UpdateScenarioDto extends PartialType(CreateScenarioDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsJSON()
  translations?: InputJsonValue;
}
