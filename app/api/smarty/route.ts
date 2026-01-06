import { NextRequest, NextResponse } from 'next/server';
import { dualAI, type SmartyContext, type SmartyHistoryItem } from '@/lib/dualAI';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      message?: string;
      context?: SmartyContext;
      history?: SmartyHistoryItem[];
    };

    if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await dualAI.sendMessage(body.message, {
      context: body.context,
      history: body.history,
    });

    return NextResponse.json({
      content: response.content,
      provider: response.provider,
      timestamp: response.timestamp.toISOString(),
      latencyMs: response.latencyMs,
    });
  } catch (error) {
    console.error('Smarty API Error:', error);
    return NextResponse.json(
      { error: 'Unable to reach Smarty right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    currentProvider: dualAI.getCurrentProvider(),
    metrics: dualAI.getMetrics(),
  });
}
