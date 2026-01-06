import type { MCQ } from './types';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
  }

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `API request failed with status ${response.status}`
      );
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from AI');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while calling the AI API');
  }
}

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

export async function generateMCQs(
  chapter: string,
  subject: string,
  count: number = 5
): Promise<MCQ[]> {
  const prompt = `Generate ${count} multiple-choice questions about "${chapter}" in ${subject}. 
  
Format the response as a JSON array with the following structure:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct",
    "difficulty": "easy"
  }
]

Make sure:
- Questions are clear and unambiguous
- All options are plausible
- Explanations are concise but informative
- Difficulty is one of: easy, medium, hard
- correctAnswer is the index (0-3) of the correct option`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }
    
    const mcqs = JSON.parse(jsonMatch[0]) as MCQ[];
    
    // Add IDs to each MCQ
    return mcqs.map((mcq, index) => ({
      ...mcq,
      id: `${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error('Error generating MCQs:', error);
    throw new Error('Failed to generate quiz questions. Please try again.');
  }
}

export async function getStudyTip(topic: string): Promise<string> {
  const prompt = `Provide a concise, helpful study tip for understanding "${topic}". 
  Keep it under 100 words and make it practical and actionable.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error getting study tip:', error);
    throw new Error('Failed to get study tip. Please try again.');
  }
}

export async function explainConcept(
  concept: string,
  subject: string,
  userClass: number
): Promise<string> {
  const prompt = `Explain "${concept}" in ${subject} for a Class ${userClass} student.
  Use simple language, provide examples, and make it easy to understand.
  Keep the explanation between 150-250 words.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error explaining concept:', error);
    throw new Error('Failed to explain concept. Please try again.');
  }
}

export async function generatePracticeProblems(
  topic: string,
  subject: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 3
): Promise<string> {
  const prompt = `Generate ${count} ${difficulty} practice problems for "${topic}" in ${subject}.
  Include the problems and their solutions.
  Format them clearly with problem numbers.`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error generating practice problems:', error);
    throw new Error('Failed to generate practice problems. Please try again.');
  }
}
