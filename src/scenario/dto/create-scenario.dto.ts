import { IsString, IsOptional, IsJSON } from 'class-validator';

export class CreateScenarioDto {
  @IsString()
  name: string;

  @IsString()
  prompt: string;

  @IsJSON()
  params: {placeholder: string, name: string, type: string}[];

  @IsOptional()
  @IsString()
  categoryId?: string;
}
