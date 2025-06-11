import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    const { title, description, fields } = await request.json();

    // Validate required fields
    if (!title || !description || !fields || !Array.isArray(fields)) {
      console.error('Invalid request data:', { title, description, fields });
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Create a prompt for Gemini
    const prompt = `Create a prompt template for a "${title}" assistant that ${description}.
The template should include placeholders for the following fields:
${fields.map((f: any) => `- ${f.name}: ${f.description}`).join('\n')}

Guidelines:
1. Use [fieldname] format for placeholders
2. Include clear instructions and guidelines
3. Structure the template logically
4. Add specific examples where relevant
5. Keep the tone professional but engaging
6. Make it easy to understand and use

Please provide a complete template that users can fill in with their specific information.`;

    console.log('Sending prompt to Gemini:', prompt);

    // Generate response from Gemini using gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    if (!suggestion) {
      throw new Error('No suggestion generated from Gemini');
    }

    return NextResponse.json({ suggestion });
  } catch (error: any) {
    console.error('Error generating prompt template:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Return a more specific error message
    return NextResponse.json(
      { 
        error: 'Failed to generate prompt template',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 