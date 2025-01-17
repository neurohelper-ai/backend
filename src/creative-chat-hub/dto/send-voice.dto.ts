import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFile } from 'nestjs-form-data';

export class SendVoiceDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Voice file' })
  @IsFile()
  @IsNotEmpty()
  content: any;

  @ApiProperty({ description: 'Model to use for processing the voice message' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ required: false, description: 'Chat ID if updating an existing chat' })
  @IsString()
  @IsOptional()
  chatId?: string;

  @ApiProperty({ description: 'Type of chat' })
  @IsString()
  @IsNotEmpty()
  chatType: string;
}
