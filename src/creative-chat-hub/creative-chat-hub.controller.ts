import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { CreativeChatHubService } from './creative-chat-hub.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { UserUtils } from 'src/utils/user-utils';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('creative-chat-hub')
@ApiBearerAuth('access-token')
@Controller('creative-chat-hub')
export class CreativeChatHubController {
  constructor(
    private readonly creativeChatHubService: CreativeChatHubService,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('/send')
  @ApiOperation({ summary: 'Send a message' })
  @ApiBody({ type: SendMessageDto })
  async sendMessage(@Req() req, @Body() dto: SendMessageDto) {
    const userId = req.user.uid;
    const userUtils: UserUtils = req.userUtils;
    return this.creativeChatHubService.sendMessage(userId, dto, userUtils);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/messages')
  @ApiOperation({ summary: 'Get chat messages by chatId' })
  async getChatMessages(@Req() req, @Query('chatId') chatId: string) {
    const userId = req.user.uid;
    return this.creativeChatHubService.getChatMessages(chatId, userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('/message/:id')
  @ApiOperation({ summary: 'Delete a message by id' })
  async removeMessage(@Req() req, @Param('id') messageId: string) {
    const userId = req.user.uid;
    return this.creativeChatHubService.removeMessage(messageId, userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/user-chats')
  @ApiOperation({ summary: 'Get all user chats' })
  async getUserChats(@Req() req) {
    const userId = req.user.uid;
    return this.creativeChatHubService.getUserChats(userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('/chat/:chatId')
  @ApiOperation({ summary: 'Delete a chat by chatId' })
  async deleteChat(@Req() req, @Param('chatId') chatId: string) {
    const userId = req.user.uid;
    return this.creativeChatHubService.deleteChat(chatId, userId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Put('/chat/:chatId')
  @ApiOperation({ summary: 'Update chat title and summary' })
  async updateChat(
    @Req() req,
    @Param('chatId') chatId: string,
    @Body('title') title: string,
    @Body('summary') summary: string,
  ) {
    const userId = req.user.uid;
    return this.creativeChatHubService.updateChat(
      chatId,
      userId,
      title,
      summary,
    );
  }
}
