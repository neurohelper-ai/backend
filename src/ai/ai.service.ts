import { Injectable } from '@nestjs/common';
import { ScenarioService } from 'src/scenario/scenario.service';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

const modelsList = ['chatgpt-4o-latest', 'gpt-4o-mini'];

const modelsPrices = [
  {
    name: 'chatgpt-4o-latest',
    inPrice: 5,
    outPrice: 15,
  },
  {
    name: 'gpt-4o-mini',
    inPrice: 0.15,
    outPrice: 0.075,
  },
];

@Injectable()
export class AiService {
  constructor(
    private scenarioService: ScenarioService,
    private userService: UserService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async execute(
    scenarioId: string,
    model: string,
    params: { placeholder: string; value: string }[],
    userId: string,
    chatId?: string,
  ) {
    const scenario = await this.scenarioService.findOne(scenarioId);
    const client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    let { prompt } = scenario;
    if (params && params.length) {
      params.forEach(({ placeholder, value }) => {
        prompt = prompt.replace(placeholder, value);
      });
    }

    if (!model) {
      model = 'gpt-4o-mini';
    }
    if (!modelsList.includes(model)) {
      throw new Error('Invalid model');
    }

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model,
    });
    const modelPrice = modelsPrices.find((m) => m.name === model);

    const tokenUsed = Math.ceil(
      (chatCompletion.usage?.completion_tokens * modelPrice.outPrice +
        chatCompletion.usage?.prompt_tokens * modelPrice.inPrice) *
        100,
    );
    console.log('tokenUsed', tokenUsed);

    const answer = chatCompletion.choices[0].message.content;
    await this.addToHistory(userId, prompt, answer, chatId);

    return { answer, tokenUsed };
  }

  async addToHistory(userId: string, prompt: string, answer: string, chatId?: string) {
    await this.prisma.chatHistory.create({
      data: {
        userId,
        prompt,
        answer,
        chatId,
      },
    });
  }

  async getChatHistory(userId: string, chatId?: string) {
    return this.prisma.chatHistory.findMany({
      where: { userId, chatId },
      orderBy: { createdAt: 'desc' },
    });
  }
}