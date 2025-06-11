import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { promptText, assistantId } = await request.json();

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
      "cold-email": "You are an expert cold email writer. Improve the following cold email prompt for clarity, persuasiveness, and effectiveness in getting a response. Focus on the hook, value proposition, and call to action.",
      "youtube-summary": "You are an expert in summarizing content. Improve the following prompt for generating a YouTube video summary, focusing on extracting key information and structuring the summary clearly.",
      "social-hook": "You are an expert in social media marketing. Improve the following prompt for generating social media hooks, focusing on making them catchy, attention-grabbing, and platform-appropriate.",
      "translator": "You are a skilled translator and cultural localization expert. Improve the following prompt for a casual translation task, focusing on maintaining the intended tone and cultural nuances.",
      "veo_3_video_gen": "You are an expert in video generation prompting. Improve the following prompt for generating a video using the Veo 3 model, focusing on descriptive language, scene setting, and specifying desired visual elements.",
      "product-review": "You are an expert product reviewer. Improve the following prompt for writing a product review, focusing on highlighting key features, balancing pros and cons, and providing a clear recommendation.",
      // Add more assistant IDs and instructions here
    };

    // Get the specific instruction or a default one
    const specificInstruction = assistantInstructions[assistantId] || "You are an expert prompt engineer. Improve the following prompt so that it becomes clearer, more specific, and more effective for its intended use. Preserve the original intent and make it suitable for use with an advanced AI model. If the original prompt is vague, make educated assumptions to enhance it. Return only the improved prompt as plain text with no extra commentary.";

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