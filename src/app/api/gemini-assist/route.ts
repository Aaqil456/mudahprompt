import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { promptText, assistantId, systemInstruction } = await request.json();

    if (!promptText) {
      return NextResponse.json({ error: 'Prompt text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Define specific instructions based on assistant ID
    const assistantInstructions: Record<string, string> = {
      "whatsapp-reply": "You are an expert in customer service communication. Improve the following WhatsApp reply to be professional, empathetic, and effective. Start with a greeting, acknowledge the situation, use the requested tone, provide a clear solution, and end with thanks. Keep it concise, friendly, and in a single paragraph. Maintain the original language.",
      "concept-explainer": "You are a skilled educator. Improve the following explanation to make a difficult concept easy to understand for the target audience. Use simple language, analogies, and avoid jargon. Keep it in a single paragraph and in the same language as the original.",
      "instagram-caption": "You are a creative social media copywriter. Improve the following Instagram caption to be catchy, engaging, and suitable for the specified audience and style. Use relevant emojis and hashtags. Keep it in a single paragraph and in the same language.",
      "resume-interview": "You are a professional career coach. Improve the following resume or interview answer to highlight strengths, use confident language, and be concise. Keep it in a single paragraph and in the same language.",
      "shopee-seller": "You are an expert e-commerce seller. Improve the following Shopee chat reply to be friendly, informative, and persuasive. Start with a greeting, answer the question clearly, and end with thanks. Keep it in a single paragraph and in the same language.",
      "study-notes": "You are an academic tutor. Improve the following study notes to be clear, concise, and easy to remember. Highlight key points and keep it in a single paragraph and in the same language.",
      "content-ideas": "You are a creative content strategist. Improve the following content ideas to be more original, engaging, and suitable for the specified platform and audience. Keep it in a single paragraph and in the same language.",
      "shopee-thread-ig": "You are a witty and playful Malaysian content writer. Improve the following Instagram Threads post for Shopee affiliate marketing. Use a 'borak mamak' (casual, chatty) style, include humor and light sarcasm, and make it highly engaging. Write 4–6 short thread posts (1–3 sentences each), use emojis, and end with a casual call-to-action and the affiliate link. Keep the language and style casual Malaysian, and maintain the original language.",
      // Add more as needed
    };

    // Get the specific instruction or a default one
    const specificInstruction = systemInstruction || assistantInstructions[assistantId] || "You are an expert prompt engineer. Improve the following prompt so that it becomes clearer, more specific, and more effective for its intended use. Preserve the original intent and make it suitable for use with an advanced AI model. If the original prompt is vague, make educated assumptions to enhance it. Return only the improved prompt as plain text with no extra commentary. The improved prompt must be in a single paragraph and in the same language as the original prompt.";

    const prompt = `${specificInstruction}\n\nOriginal Prompt:\n${promptText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const revisedPrompt = response.text();

    return NextResponse.json({ revisedPrompt });

  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json({ error: 'Failed to process prompt with Gemini' }, { status: 500 });
  }
} 