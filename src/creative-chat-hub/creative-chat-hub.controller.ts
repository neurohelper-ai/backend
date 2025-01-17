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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  CreativeChatHubService,
  SUPPORTED_MODELS,
} from './creative-chat-hub.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { UserUtils } from 'src/utils/user-utils';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { EditChatDto } from './dto/edit-chat.dto';
import { SendVoiceDto } from './dto/send-voice.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('creative-chat-hub')
@ApiBearerAuth('access-token')
@Controller('creative-chat-hub')
export class CreativeChatHubController {
  constructor(
    private readonly creativeChatHubService: CreativeChatHubService,
  ) {}

  @Get('/supported-models')
  @ApiOperation({ summary: 'Get supported models' })
  async getSupportedModels() {
    return { ok: true, data: SUPPORTED_MODELS };
  }

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
  @Post('/transcribe')
  @UseInterceptors(FileInterceptor('content'))
  @ApiOperation({ summary: 'Transcribe a voice message' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SendVoiceDto })
  async transcribeVoiceMessage(
    @Req() req,
    @UploadedFile() content: Express.Multer.File,
    @Body() dto: SendVoiceDto,
  ) {
    const userId = req.user.uid;
    const userUtils: UserUtils = req.userUtils;
    dto.content = content;
    return this.creativeChatHubService.transcribeVoiceMessage(
      userId,
      dto,
      userUtils,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('/execute')
  @ApiOperation({ summary: "Execute chat's last message" })
  async executeChat(@Req() req, @Query('chatId') chatId: string) {
    const userId = req.user.uid;
    return this.creativeChatHubService.executeChat(chatId, userId);
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
  @ApiBody({ type: EditChatDto })
  async updateChat(
    @Req() req,
    @Param('chatId') chatId: string,
    @Body() dto: EditChatDto,
  ) {
    const userId = req.user.uid;
    return this.creativeChatHubService.updateChat(
      chatId,
      userId,
      dto.title,
      dto.summary,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Put('/chat/:chatId/convert')
  @ApiOperation({ summary: 'Convert chat type from quick to context' })
  async convertChatType(@Req() req, @Param('chatId') chatId: string) {
    const userId = req.user.uid;
    return this.creativeChatHubService.convertChatType(chatId, userId);
  }
}
