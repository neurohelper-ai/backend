import { ApiProperty } from '@nestjs/swagger';

export class EditChatDto {
  @ApiProperty({ description: 'Title of the chat' })
  title: string;

  @ApiProperty({ description: 'Summary of the chat' })
  summary: string;
}
