import { Controller, Post, Body } from '@nestjs/common';
import { ExecuteTextDto } from './dto/executeText.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('execute_gpt')
  execute_gpt(@Body() body: ExecuteTextDto) {
    return this.aiService.execute(body.id, body.model, body.params);
  }
}
