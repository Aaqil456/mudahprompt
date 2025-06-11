import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface PromptTemplate {
  title: string
  description: string
  template: string
  category: string
}

interface GenerateRequest {
  category: string
  description: string
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json()
    const { category, description } = body

    const prompt = `Create a prompt template for ${category} with the following description: ${description}. 
    Return the response in this exact JSON format:
    {
      "title": "Template Title",
      "description": "Template Description",
      "template": "The actual template with {variables}",
      "category": "${category}"
    }`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const template: PromptTemplate = JSON.parse(response)

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error generating prompt template:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt template' },
      { status: 500 }
    )
  }
} 