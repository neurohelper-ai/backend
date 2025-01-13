import { ApiProperty } from '@nestjs/swagger';
import { AcceptedModel, ChatType } from '../creative-chat-hub.service';

export class SendMessageDto {
  @ApiProperty({ description: 'The content to be sent' })
  content: any[];

  @ApiProperty({
    description: 'The model to be used',
    enum: ['chatgpt-4o-latest', 'gpt-4o-mini'],
  })
  model: AcceptedModel;

  @ApiProperty({ description: 'The chat ID', required: false })
  chatId?: string;

  @ApiProperty({
    description: 'The type of chat',
    enum: ['quick', 'context'],
    required: false,
  })
  chatType?: ChatType;
}
