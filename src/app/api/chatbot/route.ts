import { NextRequest, NextResponse } from 'next/server'
import ReactMarkdown from 'react-markdown'

const EASY_PEASY_API_URL = process.env.EASY_PEASY_API_URL!;
const EASY_PEASY_API_KEY = process.env.EASY_PEASY_API_KEY!;

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
      console.error("❌ Gagal hubungi API Easy Peasy:", res.status)
      return NextResponse.json({ error: 'Failed to contact chatbot.' }, { status: 500 })
    }

    const data = await res.json()

    // ✅ Tambah log untuk lihat isi data sebenar
    console.log("📦 DATA DARI EASY PEASY:", JSON.stringify(data, null, 2))

    let reply = 'Tiada jawapan.';

    if (typeof data?.bot?.text === 'string') {
      reply = data.bot.text;
    } else if (typeof data?.response === 'string') {
      reply = data.response;
    } else if (typeof data?.message?.content === 'string') {
      reply = data.message.content;
    } else if (typeof data?.message === 'string') {
      reply = data.message;
    }


    return NextResponse.json({ reply })

  } catch (e) {
    console.error("❌ Ralat server:", e)
    return NextResponse.json({ error: 'Ralat pelayan.' }, { status: 500 })
  }
}
