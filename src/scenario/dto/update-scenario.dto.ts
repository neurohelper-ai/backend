import { PartialType } from '@nestjs/mapped-types';
import { CreateScenarioDto } from './create-scenario.dto';
import { IsOptional, IsString, IsJSON } from 'class-validator';

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
}
