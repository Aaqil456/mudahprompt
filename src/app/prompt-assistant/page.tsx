"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./PromptAssistant.module.css";
import CustomPromptList from "./components/CustomPromptList";

// Queue system for handling AI requests
class RequestQueue {
  private queue: Array<() => Promise<void>> = [];
  private isProcessing: boolean = false;
  private processingDelay: number = 1000; // 1 second delay between requests

  async add(request: () => Promise<void>) {
    return new Promise<void>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await request();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, this.processingDelay));
      }
    }
    this.isProcessing = false;
  }
}

const requestQueue = new RequestQueue();

interface PresetAssistant {
  id: string;
  title: string;
  description: string;
  fields: Array<{
    name: string;
    description: string;
    example: string;
  }>;
  template: string;
}

interface CustomAssistant {
  id: string;
  title: string;
  description: string;
  fields: string[];
  field_descriptions: string[];
  field_examples: string[];
  template: string;
}

const presetAssistants = [
  {
    id: "cold-email",
    title: "Cold Email Writer",
    description: "Write professional cold emails with clear CTAs",
    fields: [
      {
        name: "Recipient's Role",
        description: "The job title or position of the person you're emailing",
        example: "e.g., Marketing Director, CEO, HR Manager"
      },
      {
        name: "Industry",
        description: "The business sector or field they work in",
        example: "e.g., Technology, Healthcare, E-commerce"
      },
      {
        name: "Pain Point",
        description: "The main problem or challenge they're facing",
        example: "e.g., Low customer retention, High operational costs"
      },
      {
        name: "Your Solution",
        description: "How your product/service solves their problem",
        example: "e.g., AI-powered analytics platform that reduces churn by 30%"
      },
      {
        name: "Call to Action",
        description: "What you want them to do next",
        example: "e.g., Schedule a 15-minute demo, Download our case study"
      },
      {
        name: "Tone",
        description: "The overall style and mood of the email",
        example: "e.g., Professional, Conversational, Enthusiastic"
      },
      {
        name: "Length",
        description: "Approximate word count for the email",
        example: "e.g., 150-200 words, 200-250 words"
      }
    ],
    template: `Write a professional cold email with the following details:

Recipient's Role: [recipientsrole]
Industry: [industry]
Pain Point: [painpoint]
Your Solution: [yoursolution]
Call to Action: [calltoaction]
Tone: [tone]
Length: [length]

Guidelines:
- Start with a personalized hook that shows you've done your research
- Address the specific pain point they're facing
- Present your solution as a natural fit for their needs
- Include social proof or relevant statistics
- End with a clear, specific call to action
- Keep the tone [tone] and professional
- Maintain a length of approximately [length] words

Format the email with proper spacing and structure.`
  },
  {
    id: "youtube-summary",
    title: "YouTube Summarizer",
    description: "Summarize YouTube videos into clear 3-paragraph summaries",
    fields: [
      {
        name: "Video Topic",
        description: "The main subject or theme of the video",
        example: "e.g., How to Start a Business, Machine Learning Basics"
      },
      {
        name: "Key Points",
        description: "Main ideas or takeaways from the video",
        example: "e.g., 1. Market research 2. Business plan 3. Funding options"
      },
      {
        name: "Target Audience",
        description: "Who the video is intended for",
        example: "e.g., Beginners, Professionals, Students"
      },
      {
        name: "Summary Style",
        description: "How formal or casual the summary should be",
        example: "e.g., Academic, Casual, Technical"
      },
      {
        name: "Include Timestamps",
        description: "Whether to include video timestamps",
        example: "e.g., yes/no"
      }
    ],
    template: `Create a comprehensive summary of the YouTube video with these details:

Video Topic: [videotopic]
Key Points: [keypoints]
Target Audience: [targetaudience]
Summary Style: [summarystyle]
Include Timestamps: [includetimestamps]

Guidelines:
- Start with a brief overview of the video's main topic
- Break down the key points into clear, digestible sections
- Highlight any actionable insights or takeaways
- Use [summarystyle] language appropriate for [targetaudience]
- [includetimestamps === 'yes' ? 'Include relevant timestamps for key moments' : 'Focus on the content without timestamps']
- Maintain a professional yet engaging tone
- Ensure the summary is comprehensive but concise

Format the summary with clear headings and bullet points where appropriate.`
  },
  {
    id: "social-hook",
    title: "Social Media Hook Generator",
    description: "Generate catchy hooks for social media posts",
    fields: [
      {
        name: "Platform",
        description: "The social media platform you're posting on",
        example: "e.g., Instagram, LinkedIn, Twitter"
      },
      {
        name: "Content Type",
        description: "The type of content you're creating",
        example: "e.g., Product Launch, How-to Guide, Success Story"
      },
      {
        name: "Target Audience",
        description: "Who you want to reach with your post",
        example: "e.g., Entrepreneurs, Tech Professionals, Fitness Enthusiasts"
      },
      {
        name: "Tone",
        description: "The mood or style of your hook",
        example: "e.g., Humorous, Inspirational, Educational"
      },
      {
        name: "Key Message",
        description: "The main point you want to convey",
        example: "e.g., Our new AI tool saves 5 hours per week"
      },
      {
        name: "Hook Style",
        description: "The approach to grab attention",
        example: "e.g., Question, Story, Shocking Statistic"
      }
    ],
    template: `Generate engaging social media hooks with these specifications:

Platform: [platform]
Content Type: [contenttype]
Target Audience: [targetaudience]
Tone: [tone]
Key Message: [keymessage]
Hook Style: [hookstyle]

Guidelines:
- Create hooks that grab attention within the first few words
- Use [hookstyle] techniques (e.g., questions, statements, stories)
- Match the tone to [platform] best practices
- Incorporate relevant emojis and formatting
- Ensure the hook leads naturally to [keymessage]
- Keep the language appropriate for [targetaudience]
- Optimize for [platform]'s character limits and engagement patterns

Generate 3 different hooks, each with a unique approach.`
  },
  {
    id: "translator",
    title: "Casual Translator",
    description: "Translate text with a casual tone",
    fields: [
      {
        name: "Source Language",
        description: "The original language of the text",
        example: "e.g., English, Spanish, Japanese"
      },
      {
        name: "Target Language",
        description: "The language to translate into",
        example: "e.g., French, German, Chinese"
      },
      {
        name: "Content Type",
        description: "The type of content being translated",
        example: "e.g., Blog Post, Social Media, Email"
      },
      {
        name: "Tone",
        description: "The mood or style of the translation",
        example: "e.g., Casual, Professional, Humorous"
      },
      {
        name: "Formality Level",
        description: "How formal the translation should be",
        example: "e.g., Very Formal, Semi-formal, Very Casual"
      },
      {
        name: "Cultural Context",
        description: "Any cultural considerations for the translation",
        example: "e.g., Business Culture, Youth Culture, Academic"
      }
    ],
    template: `Translate the following text with these specifications:\n\nSource Language: [sourcelanguage]\nTarget Language: [targetlanguage]\nContent Type: [contenttype]\nTone: [tone]\nFormality Level: [formalitylevel]\nCultural Context: [culturalcontext]\n\nGuidelines:\n- Maintain the original meaning while adapting to [targetlanguage] cultural nuances\n- Use [tone] language appropriate for [contenttype]\n- Adjust formality to [formalitylevel] level\n- Consider [culturalcontext] in the translation\n- Preserve any idioms or expressions in a culturally appropriate way\n- Ensure the translation flows naturally in [targetlanguage]\n- Keep the translation engaging and authentic\n\nProvide both the translation and a brief explanation of any cultural adaptations made.`,
  },
  {
    id: "veo_3_video_gen",
    title: "veo 3 video gen",
    description: "Generate videos using Veo 3 model",
    fields: [
      {
        name: "Concept",
        description: "The complex idea or topic to explain",
        example: "e.g., How the Internet Works, What is Bitcoin"
      },
      {
        name: "Age Level",
        description: "The target age group for the explanation",
        example: "e.g., 5, 8, 10 years old"
      },
      {
        name: "Key Points",
        description: "The main ideas to cover in the explanation",
        example: "e.g., 1. Basic definition 2. How it's used 3. Why it matters"
      },
      {
        name: "Examples Needed",
        description: "What kind of examples to include",
        example: "e.g., Real-world scenarios, Simple analogies"
      },
      {
        name: "Visual Elements",
        description: "Visual aids to help explain the concept",
        example: "e.g., Simple diagrams, Everyday objects"
      },
      {
        name: "Learning Style",
        description: "How the audience best learns",
        example: "e.g., Visual, Hands-on, Story-based"
      }
    ],
    template: `Please provide details for generating a cinematic video scene using the following structure. Fill in the relevant sections below. You can leave optional sections blank.\n\nScene Description: Describe the location, time of day, setting, and overall mood (e.g., "A misty forest trail at sunrise").\nKey Visual Elements: List specific elements that must appear (e.g., "Cherry blossom trees swaying in the wind").\nCharacters (Optional):\n- Description: Describe characters (appearance, clothing, action).\n- Action: What are they doing?\nDialogue (Optional):\n- Style: (e.g., Casual, dramatic).\n- Text: ["Write the dialogue"].\n- Language/Accent (Optional): (e.g., English, British accent).\nCamera Style & Movement (Optional): Describe camera movement and angles (e.g., "slow pan," "wide shot").\nLighting & Atmosphere (Optional): Describe the visual tone (e.g., "warm golden hour," "foggy").\nBackground Audio (Optional): Include ambiance or music style (e.g., "rainfall," "soft piano").\nDuration: Approximate duration (e.g., 10 seconds).\nStyle or Inspiration (Optional): Mention a style or reference (e.g., "Studio Ghibli").\nOutput Instructions (Internal Guidance - No need to edit this section): Create the video in 16:9 aspect ratio, with smooth transitions, cinematic color grading, and no text or logos.\n\n---\nYour Input Below This Line:\n`,
  },
  {
    id: "product-review",
    title: "Product Review Writer",
    description: "Write engaging product reviews",
    fields: [
      {
        name: "Product Name",
        description: "The name of the product being reviewed",
        example: "e.g., iPhone 14 Pro, Nike Air Max"
      },
      {
        name: "Product Type",
        description: "The category of the product",
        example: "e.g., Smartphone, Running Shoes, Software"
      },
      {
        name: "Target Audience",
        description: "Who the review is written for",
        example: "e.g., Tech Enthusiasts, Athletes, Professionals"
      },
      {
        name: "Key Features",
        description: "Main features to highlight in the review",
        example: "e.g., Battery life, Camera quality, Comfort"
      },
      {
        name: "Pros and Cons",
        description: "Main advantages and disadvantages",
        example: "e.g., Pros: Fast performance, Great design. Cons: Expensive, Limited storage"
      },
      {
        name: "Rating",
        description: "Overall rating out of 5 or 10",
        example: "e.g., 4.5/5, 9/10"
      },
      {
        name: "Review Style",
        description: "The tone and approach of the review",
        example: "e.g., Technical, Casual, Professional"
      }
    ],
    template: `Write a comprehensive product review with these details:

Product Name: [productname]
Product Type: [producttype]
Target Audience: [targetaudience]
Key Features: [keyfeatures]
Pros and Cons: [prosandcons]
Rating: [rating]
Review Style: [reviewstyle]

Guidelines:
- Start with a compelling introduction that captures attention
- Provide a clear overview of [productname]
- Detail the key features: [keyfeatures]
- Present balanced pros and cons
- Include specific examples and use cases
- Compare with similar products in the market
- Provide a clear rating and justification
- Use [reviewstyle] writing style appropriate for [targetaudience]
- Include a strong conclusion with a clear recommendation

Format the review with clear sections, bullet points for features, and a rating summary.`
  }
];

export default function PromptAssistant() {
  const [selectedAssistant, setSelectedAssistant] = useState<PresetAssistant | null>(null);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isAssistingWithGemini, setIsAssistingWithGemini] = useState(false);
  const supabase = createClient();

  const handleGeneratePrompt = () => {
    if (selectedAssistant && Object.keys(fieldValues).length > 0) {
      let prompt = selectedAssistant.template;
      
      const fieldMappings: Record<string, string> = {};
      selectedAssistant.fields.forEach((field: any) => {
        const fieldKey = field.name.toLowerCase().replace(/\s+/g, '');
        fieldMappings[fieldKey] = fieldValues[field.name] || '';
      });

      Object.entries(fieldMappings).forEach(([key, value]) => {
        const placeholder = new RegExp(`\\[${key}\\]`, 'g');
        prompt = prompt.replace(placeholder, value);
      });

      setGeneratedPrompt(prompt);
      setIsEditing(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const handleEditPrompt = () => {
    setIsEditing(true);
    setEditedPrompt(generatedPrompt);
  };

  const handleSaveEdit = () => {
    setGeneratedPrompt(editedPrompt);
    setIsEditing(false);
  };

  const handleGeminiAssist = async () => {
    if (!editedPrompt || !selectedAssistant) return;

    setIsAssistingWithGemini(true);
    try {
      await requestQueue.add(async () => {
        const response = await fetch('/api/gemini-assist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ promptText: editedPrompt, assistantId: selectedAssistant.id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.revisedPrompt) {
          setEditedPrompt(data.revisedPrompt);
        }
      });
    } catch (error) {
      console.error('Error asking Gemini for assistance:', error);
      alert('Failed to get assistance from Gemini. Please try again.');
    } finally {
      setIsAssistingWithGemini(false);
    }
  };

  const handleAssistantSelect = (assistant: any) => {
    setSelectedAssistant(assistant);
    setFieldValues({});
    setGeneratedPrompt("");
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.promptBg} />
      
      <div className={styles.card}>
        <h1 className={styles.title}>Prompt Assistant</h1>
        
        <div className={styles.promptsGrid}>
              {presetAssistants.map((assistant) => (
            <div 
                  key={assistant.id}
              className={`${styles.promptCard} ${
                    selectedAssistant?.id === assistant.id ? styles.selected : ''
                  }`}
                  onClick={() => handleAssistantSelect(assistant)}
                >
              <h3 className={styles.promptTitle}>{assistant.title}</h3>
              <p className={styles.promptDescription}>{assistant.description}</p>
              <div className={styles.fields}>
                {assistant.fields.map((field) => (
                  <span key={field.name} className={styles.field}>
                    {field.name}
                  </span>
                ))}
              </div>
                    </div>
                  ))}
        </div>

        {selectedAssistant && (
          <>
            <div className={styles.fields}>
              {selectedAssistant.fields.map((field: any) => (
                <div key={field.name} className={styles.field}>
                  <label className={styles.label}>{field.name}</label>
                  {field.description && (
                    <p className={styles.fieldDescription}>{field.description}</p>
                  )}
                  {field.example && (
                    <p className={styles.fieldExample}>{field.example}</p>
                  )}
                  <textarea
                    className={styles.textarea}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.name}...`}
                  />
                </div>
              ))}
            </div>

            <button 
              className={styles.button}
              onClick={handleGeneratePrompt}
              disabled={!selectedAssistant || Object.keys(fieldValues).length === 0}
            >
              Generate Prompt
            </button>

            {generatedPrompt && (
              <div className={styles.output}>
                <div className={styles.outputHeader}>
                  <h3 className={styles.outputTitle}>Generated Prompt</h3>
                  <div className={styles.outputActions}>
                    <button
                      className={styles.actionButton}
                      onClick={handleEditPrompt}
                    >
                      Edit
                    </button>
                    {isEditing && (
                      <button
                        className={styles.actionButton}
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    )}
                    <button
                      className={styles.actionButton}
                      onClick={handleCopyPrompt}
                    >
                      Copy
                    </button>
                    {isEditing && (
                      <button
                        className={styles.actionButton}
                        onClick={handleGeminiAssist}
                        disabled={isAssistingWithGemini}
                      >
                        {isAssistingWithGemini ? 'Asking...' : 'Ask Gemini'}
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  className={`${styles.outputTextarea} ${isEditing ? styles.editing : ''}`}
                  value={isEditing ? editedPrompt : generatedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  readOnly={!isEditing}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 