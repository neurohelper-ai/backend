import { Injectable } from '@nestjs/common';
import { ScenarioService } from 'src/scenario/scenario.service';

import OpenAI from 'openai';
import { UserService } from 'src/user/user.service';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

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
  ) {}

  async execute(
    userId: string,
    scenarioId: string,
    model: string,
    params: { placeholder: string; value: string }[],
  ) {
    const scenario = await this.scenarioService.findOne(scenarioId);

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

    this.userService.withdraw(userId, tokenUsed);
    return chatCompletion.choices[0].message.content;
  }
}
