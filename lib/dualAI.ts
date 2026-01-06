export interface AIResponse {
  content: string;
  provider: 'openai' | 'gemini';
  timestamp: Date;
  latencyMs: number;
}

export interface ProviderMetrics {
  successes: number;
  failures: number;
  lastSuccess?: Date;
  lastFailure?: Date;
  lastLatencyMs?: number;
}

export interface FailureMetrics {
  openai: ProviderMetrics;
  gemini: ProviderMetrics;
}

export interface SmartyContext {
  class?: number;
  subject?: string;
  chapter?: string;
}

export interface SmartyHistoryItem {
  sender: 'user' | 'smarty';
  content: string;
}

class DualAIProvider {
  private lastWorkingProvider: 'openai' | 'gemini' = 'openai';
  private metrics: FailureMetrics = {
    openai: { successes: 0, failures: 0 },
    gemini: { successes: 0, failures: 0 },
  };

  private readonly SMARTY_SYSTEM_PROMPT = `You are Smarty, a supportive and friendly AI tutor helping students learn.
Act like an older sibling, not a teacher. Keep responses to 2-3 sentences max, unless asked for more detail.
Be encouraging, use simple language, and ask guiding questions when appropriate.
Never lecture. Always make learning feel achievable and fun.
Use minimal emojis (only when truly helpful).
If the question is off-topic, gently redirect to studies.`;

  async sendMessage(
    userMessage: string,
    options?: {
      context?: SmartyContext;
      history?: SmartyHistoryItem[];
    }
  ): Promise<AIResponse> {
    const primaryProvider = this.lastWorkingProvider;
    const fallbackProvider = primaryProvider === 'openai' ? 'gemini' : 'openai';

    try {
      if (primaryProvider === 'openai') {
        return await this.callOpenAI(userMessage, options);
      }
      return await this.callGemini(userMessage, options);
    } catch (primaryError) {
      console.warn(`[Smarty] ${primaryProvider} failed, attempting fallback...`, primaryError);

      try {
        if (fallbackProvider === 'openai') {
          return await this.callOpenAI(userMessage, options);
        }
        return await this.callGemini(userMessage, options);
      } catch (fallbackError) {
        console.error('[Smarty] Both providers failed:', primaryError, fallbackError);
        throw new Error('Unable to reach Smarty right now. Please try again in a moment.');
      }
    }
  }

  private buildSystemPrompt(context?: SmartyContext): string {
    if (!context?.class && !context?.subject && !context?.chapter) {
      return this.SMARTY_SYSTEM_PROMPT;
    }

    const contextParts = [
      context.class ? `Class ${context.class}` : null,
      context.subject ? `Subject: ${context.subject}` : null,
      context.chapter ? `Chapter: ${context.chapter}` : null,
    ].filter(Boolean);

    return `${this.SMARTY_SYSTEM_PROMPT}\n\nStudent context: ${contextParts.join(' · ')}`;
  }

  private normalizeHistory(history?: SmartyHistoryItem[]): SmartyHistoryItem[] {
    if (!history?.length) return [];
    return history
      .filter((m) => typeof m.content === 'string' && m.content.trim().length > 0)
      .slice(-12);
  }

  private resolveOpenAIKey(): string | undefined {
    return process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  }

  private resolveGeminiKey(): string | undefined {
    return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }

  private async callOpenAI(
    userMessage: string,
    options?: { context?: SmartyContext; history?: SmartyHistoryItem[] }
  ): Promise<AIResponse> {
    const apiKey = this.resolveOpenAIKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = this.buildSystemPrompt(options?.context);
    const history = this.normalizeHistory(options?.history);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const startedAt = Date.now();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            { role: 'user', content: userMessage },
          ],
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string' || content.trim().length === 0) {
        throw new Error('Invalid OpenAI response format');
      }

      const latencyMs = Date.now() - startedAt;

      this.lastWorkingProvider = 'openai';
      this.recordSuccess('openai', latencyMs);

      console.info(`[Smarty] openai success in ${latencyMs}ms`);

      return {
        content,
        provider: 'openai',
        timestamp: new Date(),
        latencyMs,
      };
    } catch (error) {
      this.recordFailure('openai');
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async callGemini(
    userMessage: string,
    options?: { context?: SmartyContext; history?: SmartyHistoryItem[] }
  ): Promise<AIResponse> {
    const apiKey = this.resolveGeminiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const systemPrompt = this.buildSystemPrompt(options?.context);
    const history = this.normalizeHistory(options?.history);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const startedAt = Date.now();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              ...history.map((m) => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
              })),
              {
                role: 'user',
                parts: [{ text: userMessage }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
              topP: 0.9,
            },
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      const parts = data?.candidates?.[0]?.content?.parts;
      const content = Array.isArray(parts)
        ? parts.map((p: any) => p?.text).filter(Boolean).join('')
        : undefined;

      if (typeof content !== 'string' || content.trim().length === 0) {
        throw new Error('Invalid Gemini response format');
      }

      const latencyMs = Date.now() - startedAt;

      this.lastWorkingProvider = 'gemini';
      this.recordSuccess('gemini', latencyMs);

      console.info(`[Smarty] gemini success in ${latencyMs}ms`);

      return {
        content,
        provider: 'gemini',
        timestamp: new Date(),
        latencyMs,
      };
    } catch (error) {
      this.recordFailure('gemini');
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private recordFailure(provider: 'openai' | 'gemini'): void {
    const current = this.metrics[provider];
    current.failures += 1;
    current.lastFailure = new Date();

    console.warn(`[Smarty Analytics] ${provider} failure #${current.failures}`);
  }

  private recordSuccess(provider: 'openai' | 'gemini', latencyMs: number): void {
    const current = this.metrics[provider];
    current.successes += 1;
    current.lastSuccess = new Date();
    current.lastLatencyMs = latencyMs;
    current.failures = 0;
  }

  getMetrics(): FailureMetrics {
    return this.metrics;
  }

  getCurrentProvider(): 'openai' | 'gemini' {
    return this.lastWorkingProvider;
  }
}

export const dualAI = new DualAIProvider();
