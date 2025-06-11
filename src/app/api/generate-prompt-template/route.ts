import { NextResponse } from 'next/server'

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

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json()
    const { category, description } = body

    // Return a basic template
    const template: PromptTemplate = {
      title: `${category} Template`,
      description: description,
      template: `You are a ${category} expert. ${description}`,
      category: category
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error generating prompt template:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt template' },
      { status: 500 }
    )
  }
} 