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
    console.log('tokenUsed', tokenUsed);

    return { answer: chatCompletion.choices[0].message.content, tokenUsed };
  }
}
`
Greece is renowned for its diverse and delicious cuisine, and the best food can be found throughout the country, often featuring fresh, local ingredients and traditional recipes. Here are some notable regions and cities where you can experience exceptional Greek food:

1. **Athens**: The capital is a vibrant hub for food lovers. You can find everything from street food at the famous Central Market to fine dining. Don't miss trying souvlaki, moussaka, and traditional meze.

2. **Santorini**: Known for its stunning views and unique volcanic soil, Santorini offers delicious local dishes. Try fresh seafood, fava (split pea puree), and local wines such as Assyrtiko.

3. **Crete**: The largest Greek island boasts its own distinct culinary traditions. Cretan cuisine emphasizes fresh vegetables, olive oil, and local cheese. Don't miss trying dakos (Cretan barley rusk), raki, and traditional lamb dishes.

4. **Thessaloniki**: Known for its rich gastronomy, this northern city offers diverse flavors influenced by various cultures. Try the local delicacies like bougatsa (savory pastry) and gyros.

5. **Peloponnese**: This region is famous for its agricultural products, including olives, figs, and meats. Enjoy local dishes such as sweet basil sauce with pasta and fresh seafood.

6. **Nafplio**: This picturesque town is known for its excellent tavernas serving regional specialties. Look for dishes featuring fresh fish, local cheeses, and flavorful vegetable stews.

7. **Meteora**: While primarily known for its monasteries, Meteora also offers great local food. Try traditional Greek dishes at the local tavernas while enjoying stunning views.

8. **Island Hopping**: Each Greek island has unique flavors. For example, seafood is a must on the Cyclades, while the Dodecanese islands have fabulous meze platters.

When visiting Greece, exploring local tavernas and markets is a wonderful way to experience authentic flavors. Don't forget to savor traditional desserts like baklava and loukoum as well!
`