import { ApiProperty } from '@nestjs/swagger';

type AcceptedModel = 'chatgpt-4o-latest' | 'gpt-4o-mini';

export class SendMessageDto {
  @ApiProperty({ description: 'The message to be sent' })
  message: string;

  @ApiProperty({
    description: 'The model to be used',
    enum: ['chatgpt-4o-latest', 'gpt-4o-mini'],
  })
  model: AcceptedModel;

  @ApiProperty({ description: 'The chat ID', required: false })
  chatId?: string;
}
