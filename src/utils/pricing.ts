export const OPENAI_GPT_PRICING = {
  'gpt-4o-mini': {
    input: 0.150 / 1_000_000,
    cachedInput: 0.075 / 1_000_000,
    output: 0.600 / 1_000_000,
  },
  'gpt-4o': {
    input: 2.50 / 1_000_000,
    cachedInput: 1.25 / 1_000_000,
    output: 10.00 / 1_000_000,
  },
  'o1': {
    input: 15.00 / 1_000_000,
    cachedInput: 7.50 / 1_000_000,
    output: 60.00 / 1_000_000,
  },
  'o1-mini': {
    input: 3.00 / 1_000_000,
    cachedInput: 1.50 / 1_000_000,
    output: 12.00 / 1_000_000,
  },
};

export const DALLE_3_PRICING = 0.04

export const WHISPER_PRICING = 0.006 ; // / min

export function calculateTotalCost(model: string, inputTokens: number, cachedInputTokens: number, outputTokens: number): number {
  const pricing = OPENAI_GPT_PRICING[model];
  if (!pricing) {
    throw new Error(`Pricing for model ${model} not found`);
  }

  const inputCost = pricing.input * inputTokens;
  const cachedInputCost = pricing.cachedInput * cachedInputTokens;
  const outputCost = pricing.output * outputTokens;

  return inputCost + cachedInputCost + outputCost;
}

export const CREDIT_RATE = 0.000008;