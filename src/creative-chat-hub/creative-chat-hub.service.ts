import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';
import { FirebaseUserInfo, UserUtils } from 'src/utils/user-utils';

type AcceptedModel = 'chatgpt-4o-latest' | 'gpt-4o-mini';

@Injectable()
export class CreativeChatHubService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(userId: string, dto: SendMessageDto, userUtils: UserUtils) {
    const { message, model, chatId } = dto;
    const chatUuid = chatId || uuidv4();

    // Get user credits from the request
    const leftTokens: FirebaseUserInfo = userUtils.getUserInfo();
    const userCredits = leftTokens.subscription.creditsLeft;

    // Calculate token usage via tiktoken
    const tokenUsage = this.calculateTokenUsage(message, model);

    if (userCredits < tokenUsage) {
      return { ok: false, details: 'Not enough tokens' };
    }

    // Get response from ChatGPT
    const response = await this.getChatGPTResponse(message, model, chatUuid);

    // Save message to DB
    await this.prisma.chatHistory.create({
      data: {
        userId,
        chatId: chatUuid,
        prompt: message,
        answer: response,
        model, // Add model field here
        createdAt: new Date(),
      },
    });

    // Handle UserChat creation or update
    await this.handleUserChat(userId, chatUuid, message);

    return { ok: true, response, chatUuid };
  }

  async handleUserChat(userId: string, chatId: string, message: string) {
    const existingChat = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (!existingChat) {
      const title = await this.generateTitle(message);
      const summary = await this.generateSummary(message);

      await this.prisma.userChat.create({
        data: {
          chatId,
          userId,
          title,
          summary,
          createdAt: new Date(),
        },
      });
    }
  }

  async generateTitle(message: string): Promise<string> {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate a title for the following message (very short): ${message}`,
        },
      ],
      model: 'gpt-4o-mini',
    });

    return response.choices[0].message.content.trim();
  }

  async generateSummary(message: string): Promise<string> {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate a summary for the following message (very short): ${message}`,
        },
      ],
      model: 'gpt-4o-mini',
    });

    return response.choices[0].message.content.trim();
  }

  async getUserChats(userId: string) {
    return this.prisma.userChat.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deleteChat(chatId: string, userId: string) {
    const chat = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (!chat || chat.userId !== userId) {
      throw new Error('Unauthorized access or chat not found');
    }

    await this.prisma.chatHistory.deleteMany({
      where: { chatId },
    });

    await this.prisma.userChat.delete({
      where: { chatId },
    });

    return { ok: true, message: 'Chat and messages deleted successfully' };
  }

  async updateChat(
    chatId: string,
    userId: string,
    title: string,
    summary: string,
  ) {
    const chat = await this.prisma.userChat.findUnique({
      where: { chatId },
    });

    if (!chat || chat.userId !== userId) {
      throw new Error('Unauthorized access or chat not found');
    }

    await this.prisma.userChat.update({
      where: { chatId },
      data: { title, summary },
    });

    return { ok: true, message: 'Chat updated successfully' };
  }

  async getChatMessages(chatId: string, userId: string) {
    const chatMessages = await this.prisma.chatHistory.findMany({
      where: { chatId, userId },
      orderBy: { createdAt: 'asc' },
    });

    if (chatMessages.length === 0) {
      throw new Error('Unauthorized access or no messages found');
    }

    return chatMessages;
  }

  async removeMessage(messageId: string, userId: string) {
    const message = await this.prisma.chatHistory.findUnique({
      where: { id: messageId },
    });

    if (!message || message.userId !== userId) {
      throw new Error('Unauthorized access or message not found');
    }

    await this.prisma.chatHistory.delete({
      where: { id: messageId },
    });

    return { ok: true, message: 'Message deleted successfully' };
  }

  calculateTokenUsage(message: string, model: AcceptedModel): number {
    const encoding = encoding_for_model(model);
    const tokens = encoding.encode(message);
    return tokens.length;
  }

  async getChatGPTResponse(
    message: string,
    model: AcceptedModel,
    chatId?: string,
  ): Promise<string> {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let messages = [{ role: 'user', content: message }];

    if (model === 'chatgpt-4o-latest' && chatId) {
      const chatHistory = await this.prisma.chatHistory.findMany({
        where: { chatId },
        orderBy: { createdAt: 'asc' },
      });

      messages = chatHistory.flatMap((entry) => [
        { role: 'user', content: entry.prompt },
        { role: 'assistant', content: entry.answer },
      ]);

      messages.push({ role: 'user', content: message });

      console.log('Chat History:', messages); // Log the history for debugging purposes
    }

    const chatCompletion = await client.chat.completions.create({
      messages: messages as any,
      model,
    });

    return chatCompletion.choices[0].message.content;
  }
}
