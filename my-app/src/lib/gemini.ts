import Constants from 'expo-constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-2.0-flash';

function getApiKey(): string {
  const key = Constants.expoConfig?.extra?.geminiApiKey as string | undefined;
  if (!key || !key.trim()) {
    throw new Error(
      'Missing Gemini API key. Add GEMINI_API_KEY to my-app/.env and restart Expo.'
    );
  }
  return key.trim();
}

function getModel() {
  return new GoogleGenerativeAI(getApiKey()).getGenerativeModel({ model: MODEL });
}

export async function askGeminiTutor(
  question: string,
  context: { display: string; notes: string }
): Promise<string> {
  const model = getModel();
  const prompt = [
    'You are a friendly math tutor inside StudyCalc AI.',
    `Calculator expression: "${context.display}"`,
    `Student notes: "${context.notes}"`,
    'Solve step by step. Use plain-text math notation.',
    '',
    `Student question: ${question}`,
  ].join('\n');

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function solveImageWithGemini(
  base64: string,
  mimeType: string
): Promise<string> {
  const model = getModel();
  const result = await model.generateContent([
    {
      inlineData: { mimeType, data: base64 },
    },
    {
      text: 'Read every math problem in this image and solve each one step by step. Be clear and encouraging.',
    },
  ]);
  return result.response.text();
}
