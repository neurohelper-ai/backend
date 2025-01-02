import { Controller, Post, Body, Req, Get, Query } from '@nestjs/common';
import { ExecuteTextDto } from './dto/executeText.dto';
import { AiService } from './ai.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly userService: UserService,
  ) {}

  @Post('execute_gpt')
  async execute_gpt(@Body() body: ExecuteTextDto, @Req() req) {
    const user: User = req.user;
    if (user.tokens < 1) {
      return {
        success: false,
        message: 'Not enough tokens',
      };
    }
    const response = await this.aiService.execute(
      body.id,
      body.model,
      body.params,
      user.id,
      body.chatId,
    );
    await this.userService.withdraw(user.id, response.tokenUsed);
    return {
      success: true,
      response,
    };
  }

  @Get('get_chat_history')
  async get_chat_history(@Req() req, @Query('chatId') chatId: string) {
    const user: User = req.user;
    const chatHistory = await this.aiService.getChatHistory(user.id, chatId);
    return {
      success: true,
      chatHistory,
    };
  }
}
