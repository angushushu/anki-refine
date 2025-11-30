import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, Language } from "../types";

const defaultApiKey = process.env.API_KEY;

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation of the concept covered in the card to ensure the user understands it."
    },
    critique: {
      type: Type.STRING,
      description: "A critique of the card based on the minimum information principle and other Anki best practices."
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "The front text of the improved card (HTML format)." },
          back: { type: Type.STRING, description: "The back text of the improved card (HTML format)." },
          reason: { type: Type.STRING, description: "Why this version is better." }
        },
        required: ["front", "back", "reason"]
      },
      description: "A list of one or more improved versions of the card, split into atomic facts if necessary."
    }
  },
  required: ["explanation", "critique", "suggestions"]
};

export const analyzeWithGemini = async (front: string, back: string, language: Language, userApiKey?: string): Promise<AnalysisResult> => {
  const keyToUse = userApiKey || defaultApiKey;

  if (!keyToUse) {
    throw new Error("API Key is missing. Please configure your environment or settings.");
  }

  // Initialize a new client per request to ensure the correct key is used
  const ai = new GoogleGenAI({ apiKey: keyToUse });

  const prompt = `
    I am studying using Anki flashcards. I want you to act as an expert in learning science, specifically focused on Spaced Repetition and the Minimum Information Principle (SuperMemo 20 rules).
    
    Here is my current card:
    FRONT: ${front}
    BACK: ${back}

    Please perform the following tasks:
    1. Explain the meaning of the content on this card to ensure I fully understand it. The explanation MUST be in ${language}.
    2. Critique the card structure. Is it too vague? Too complex? Does it have context clues that give away the answer? Is it atomic enough? The critique MUST be in ${language}.
    3. Suggest one or more improved versions of this card. If the original card covers multiple facts, split them into multiple atomic cards.
    
    IMPORTANT FORMATTING RULES:
    - The 'front' and 'back' fields of the suggested cards MUST be formatted using standard HTML tags supported by Anki (e.g., <b>, <i>, <u>, <br>, <ul>, <li>, <code>, <pre>).
    - Do NOT use Markdown syntax (like **, ##, -) for the 'front' and 'back' fields. Anki does not render Markdown natively.
    - Ensure code snippets are wrapped in <code> tags or <pre><code> blocks if multi-line.
    - The 'reason' field should be in ${language}.

    Think deeply about the best way to formulate these memories for long-term retention.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing card with Gemini:", error);
    throw error;
  }
};
