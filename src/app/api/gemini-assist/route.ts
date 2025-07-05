import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { assistantInstructions } from '@/lib/prompt-assistant/assistantInstructions';

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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