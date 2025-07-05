import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assistantId = searchParams.get('assistantId');
  if (!assistantId) {
    return NextResponse.json({ error: 'Missing assistantId' }, { status: 400 });
  }

  const supabase = await createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('assistant_instructions')
    .select('instruction')
    .eq('user_id', user.id)
    .eq('assistant_id', assistantId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ instruction: data?.instruction || null });
}

export async function POST(request: Request) {
  const supabase = await createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { assistantId, instruction } = await request.json();
  if (!assistantId || !instruction) {
    return NextResponse.json({ error: 'Missing assistantId or instruction' }, { status: 400 });
  }

  // Upsert (insert or update) the instruction for this user and assistant
  const { error } = await supabase
    .from('assistant_instructions')
    .upsert({
      user_id: user.id,
      assistant_id: assistantId,
      instruction,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,assistant_id' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
