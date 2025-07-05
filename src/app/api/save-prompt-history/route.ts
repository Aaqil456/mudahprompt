import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = await createClient(cookies());
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { assistantId, prompt } = await request.json();
    if (!assistantId || !prompt) {
      return NextResponse.json({ error: 'Missing assistantId or prompt' }, { status: 400 });
    }
    const { error } = await supabase.from('prompt_history').insert({
      user_id: user.id,
      assistant_id: assistantId,
      prompt,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 