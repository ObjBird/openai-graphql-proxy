import OpenAI from 'openai';

interface OpenAIServiceConfig {
  apiKey: string;
  referer: string;
  appTitle: string;
}

export class OpenAIService {
  private client: OpenAI;
  private apiKey: string;
  private referer: string;
  private appTitle: string;

  constructor({ apiKey, referer, appTitle }) {
    this.apiKey = apiKey;
    this.referer = referer;
    this.appTitle = appTitle;
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': referer,
        'X-Title': appTitle
      }
    });
  }

  async createChatStream(message: string) {
    const stream = await this.client.chat.completions.create({
      model: 'google/gemini-2.5-flash-preview', // OpenRouter 的模型标识符
      messages: [{ role: 'user', content: message }],
      stream: true,
    });

    return stream;
  }

  async createChatCompletion(prompt: string, model: string) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': this.referer,
        'X-Title': this.appTitle
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个有帮助的AI助手。请直接回答用户的问题，不要质疑他们的输入内容。如果用户输入不明确或简短，尝试理解并提供最相关的回应。请用中文回复。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    return await response.json();
  }
}