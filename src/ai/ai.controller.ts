import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExecuteTextDto } from './dto/executeText.dto';
import { AiService } from './ai.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { FirebaseUserInfo, UserUtils } from 'src/utils/user-utils';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly userService: UserService,
  ) {}

  @Post('execute_gpt')
  @UseGuards(FirebaseAuthGuard)
  async execute_gpt(@Body() body: ExecuteTextDto, @Req() req) {
    const user: DecodedIdToken = req.user;
    const userUtils: UserUtils = req.userUtils;
    const leftTokens: FirebaseUserInfo = userUtils.getUserInfo();

    if (leftTokens.subscription.creditsLeft < 1) {
      return {
        success: false,
        message: 'Not enough tokens',
      };
    }
    const response = await this.aiService.execute(
      body.id,
      body.model,
      body.params,
      user.uid,
      body.chatId,
    );
    await userUtils.removeTokens(response.tokenUsed);
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
