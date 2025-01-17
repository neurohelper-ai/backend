import { Injectable } from '@nestjs/common';
// import { File as MulterFile } from 'multer';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { SendMessageDto } from './dto/send-message.dto';
import { v4 as uuidv4 } from 'uuid';
// import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';
import { FirebaseUserInfo, UserUtils } from 'src/utils/user-utils';
import OpenAI from 'openai';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendVoiceDto } from './dto/send-voice.dto';
import { PassThrough } from 'stream';
import { buffer } from 'stream/consumers';

export type AcceptedModel =
  | 'chatgpt-4o-latest'
  | 'gpt-4o-mini'
  | 'chatgpt-o1'
  | 'chatgpt-o1-mini'
  | 'dall-e-3';
export type ChatType = 'quick' | 'context';

export const SUPPORTED_MODELS = [
  {
    title: 'Science, Code & Complex texts',
    model: 'o1-preview',
  },
  {
    title: 'Science, Code & Complex texts (mini)',
    model: 'o1-mini',
  },
  {
    title: 'Regular',
    model: 'gpt-4o-mini',
  },
  {
    title: 'Performance',
    model: 'chatgpt-4o-latest',
  },
  {
    title: 'Image generator',
    model: 'dall-e-3',
  },
];

@Injectable()
export class CreativeChatHubService {
  client: OpenAI;

  constructor(private prisma: PrismaService) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async convertChatType(chatId: string, userId: string) {
    const chatObj = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (chatObj!.chatType === 'quick') {
      await this.prisma.userChat.update({
        where: { chatId },
        data: { chatType: 'context' },
      });
      return { ok: true, details: 'Chat converted to context mode' };
    } else return { ok: false, details: 'Chat is already in context mode' };
  }

  async getChatMessages(chatId: string, userId: string) {
    const chatObj = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (chatObj!.userId !== userId) {
      return { ok: false, details: 'Unauthorized' };
    }

    const messages = await this.prisma.userChatMessage.findMany({
      where: { chatId },
    });

    return { ok: true, details: messages };
  }

  async removeMessage(messageId: string, userId: string) {
    const message = await this.prisma.userChatMessage.findUnique({
      where: { id: messageId },
    });

    if (message!.userId !== userId) {
      return { ok: false, details: 'Unauthorized' };
    }

    await this.prisma.userChatMessage.delete({
      where: { id: messageId },
    });

    return { ok: true, details: 'Message deleted' };
  }

  async getUserChats(userId: string) {
    const chats = await this.prisma.userChat.findMany({
      where: { userId },
    });

    return { ok: true, details: chats };
  }

  async deleteChat(chatId: string, userId: string) {
    const chatObj = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (chatObj!.userId !== userId) {
      return { ok: false, details: 'Unauthorized' };
    }

    await this.prisma.userChat.delete({
      where: { chatId },
    });

    return { ok: true, details: 'Chat deleted' };
  }

  async updateChat(
    chatId: string,
    userId: string,
    title: string,
    summary: string,
  ) {
    const chatObj = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (chatObj!.userId !== userId) {
      return { ok: false, details: 'Unauthorized' };
    }

    await this.prisma.userChat.update({
      where: { chatId },
      data: { title, summary },
    });

    return { ok: true, details: 'Chat updated successfully' };
  }

  async sendMessage(userId: string, dto: SendMessageDto, userUtils: UserUtils) {
    const { content, model, chatId, chatType } = dto;
    const message = this.extractMessage(content);
    const chatUuid = chatId || uuidv4();

    await this.ensureChatObj(chatUuid, userId, message, chatType);
    await this.prisma.userChatMessage.create({
      data: {
        chatId: chatUuid,
        userId,
        role: 'user',
        content: content,
        model,
      },
    });
    var newMsg: any;

    if (dto.model == 'dall-e-3')
      newMsg = await this.generateDallE3Image(chatUuid, userId, message);
    else newMsg = await this.processMsg(chatUuid);

    return { ok: true, details: newMsg };
  }

  async transcribeVoiceMessage(
    userId: string,
    dto: SendVoiceDto,
    userUtils: UserUtils,
  ) {
    const { content, model, chatId, chatType } = dto;
    const chatUuid = chatId || uuidv4();

    const file = new File([content.buffer], content.originalname, {
      type: content.mimetype,
    });

    // Transcribe the voice message using OpenAI Whisper model
    const transcription = await this.client.audio.transcriptions.create({
      model: 'whisper-1',
      file: file,
    });

    const transcribedText = transcription.text;

    const textContent = [
      {
        type: 'text',
        text: `Voice Message: ${transcribedText}`,
      },
    ];
    await this.ensureChatObj(
      chatUuid,
      userId,
      transcribedText,
      chatType as ChatType,
    );
    const transcribedMsg = {
      chatId: chatUuid,
      userId,
      role: 'user',
      content: textContent,
      model,
      createdAt: new Date(),
    };
    await this.prisma.userChatMessage.create({
      data: transcribedMsg,
    });

    return { ok: true, details: transcribedMsg };
  }

  async executeChat(chatId: string, userId: string) {
    let history = await this.prisma.userChatMessage.findMany({
      where: { chatId },
    });
    const chatInfo = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (chatInfo!.userId !== userId) {
      return { ok: false, details: 'Unauthorized' };
    }

    const response = await this.client.chat.completions.create({
      messages: (chatInfo!.chatType === 'context'
        ? history
        : [history[history.length - 1]]
      ).map((item) => ({
        role: item.role,
        content: item.content,
      })) as any,
      model: history[history.length - 1].model,
    });

    const newContent = response.choices[0].message;
    const newMsg = {
      chatId,
      userId: chatInfo!.userId,
      role: newContent.role,
      content: [
        {
          type: 'text',
          text: newContent.content,
        },
      ],
      model: history[history.length - 1].model,
      createdAt: new Date(),
    };

    await this.prisma.userChatMessage.create({
      data: newMsg,
    });

    return { ok: true, details: newMsg };
  }

  async processVoiceMsg(chatUuid: string) {
    let history = await this.prisma.userChatMessage.findMany({
      where: { chatId: chatUuid },
    });
    const chatInfo = await this.prisma.userChat.findUnique({
      where: { chatId: chatUuid },
    });

    const response = await this.client.chat.completions.create({
      messages: (chatInfo!.chatType === 'context'
        ? history
        : [history[history.length - 1]]
      ).map((item) => ({
        role: item.role,
        content: item.content,
      })) as any,
      model: history[history.length - 1].model,
    });

    const newContent = response.choices[0].message;
    const newMsg = {
      chatId: chatUuid,
      userId: chatInfo!.userId,
      role: newContent.role,
      content: [
        {
          type: 'text',
          text: newContent.content,
        },
      ],
      model: history[history.length - 1].model,
      createdAt: new Date(),
    };

    await this.prisma.userChatMessage.create({
      data: newMsg,
    });

    console.log(JSON.stringify(response, null, 2));

    return newMsg;
  }

  async generateDallE3Image(chatId: string, userId: string, message: string) {
    const image = await this.client.images.generate({
      model: 'dall-e-3',
      prompt: message,
    });

    console.log(image.data);

    const newMsg = {
      chatId: chatId,
      userId: userId,
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'A DALL-E-3 generated image with prompt: ' + message,
        },
        ...image.data.map((item) => ({
          type: 'image_url',
          image_url: item as any,
        })),
      ],
      model: 'dall-e-3',
      createdAt: new Date(),
    };

    await this.prisma.userChatMessage.create({
      data: newMsg,
    });

    return newMsg;
  }

  extractMessage(content: any[]) {
    if (content.length === 1) {
      return content[0].text;
    }
  }

  async processMsg(chatUuid: string) {
    let history = await this.prisma.userChatMessage.findMany({
      where: { chatId: chatUuid },
    });
    const chatInfo = await this.prisma.userChat.findUnique({
      where: { chatId: chatUuid },
    });

    const isO1Model = history[history.length - 1].model.includes('o1');

    const response = await this.client.chat.completions.create({
      messages: (chatInfo!.chatType === 'context'
        ? history
        : [history[history.length - 1]]
      ).map((item) => ({
        //if there's type=image_url, then role=user
        role:
          (item.content as any[]).some((c) => c.type === 'image_url') &&
          !isO1Model
            ? 'user'
            : item.role,
        content: isO1Model
          ? (item.content as any[]).filter((c) => c.type !== 'image_url')
          : item.content,
      })) as any,
      model: history[history.length - 1].model,
    });
    const newContent = response.choices[0].message;
    const newMsg = {
      chatId: chatUuid,
      userId: chatInfo!.userId,
      role: newContent.role,
      content: [
        {
          type: 'text',
          text: newContent.content,
        },
      ],
      model: history[history.length - 1].model,
      createdAt: new Date(),
    };

    await this.prisma.userChatMessage.create({
      data: newMsg,
    });

    console.log(JSON.stringify(response, null, 2));

    return newMsg;
  }

  async simpleChatGPTCall(message: string) {
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'gpt-4o-mini',
    });

    return response.choices[0].message.content.trim();
  }

  async ensureChatObj(
    chatId: string,
    userId: string,
    message: string,
    chatType: ChatType,
  ) {
    const chatObj = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (!chatObj) {
      await this.prisma.userChat.create({
        data: {
          chatId,
          userId,
          title: await this.simpleChatGPTCall(
            `Generate a title for the following message (very short): ${message}`,
          ),
          summary: await this.simpleChatGPTCall(
            `Generate a summary for the following message (very short): ${message}`,
          ),
          chatType,
        },
      });
    }
  }
}
