import { IsString, IsOptional, IsJSON } from 'class-validator';

export class ExecuteTextDto {
  @IsString()
  id: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsJSON()
  params: { placeholder: string; value: string }[];
}
