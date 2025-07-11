import { NextRequest, NextResponse } from 'next/server'

const EASY_PEASY_API_URL = 'https://bots.easy-peasy.ai/bot/99648959-8561-45f7-9de7-203a6d07e554/api'
const EASY_PEASY_API_KEY = 'a4cc18de-8311-429d-9948-ed0045cf7b45'

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()
    const res = await fetch(EASY_PEASY_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': EASY_PEASY_API_KEY
      },
      body: JSON.stringify({
        message,
        history: history || [],
        stream: false,
        include_sources: false
      })
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to contact chatbot.' }, { status: 500 })
    }
    const data = await res.json()
    return NextResponse.json({ reply: data?.response || data?.message || 'Tiada jawapan.' })
  } catch (e) {
    return NextResponse.json({ error: 'Ralat pelayan.' }, { status: 500 })
  }
} 