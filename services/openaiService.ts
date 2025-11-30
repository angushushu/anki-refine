import { AnalysisResult, Language } from "../types";

export const analyzeWithOpenAI = async (
  front: string, 
  back: string, 
  language: Language, 
  apiKey: string,
  baseUrl: string = "https://api.openai.com/v1",
  model: string = "gpt-4o"
): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please add it in Settings.");
  }

  // Ensure baseUrl doesn't end with a slash for consistency, but handle if user adds it
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const endpoint = `${cleanBaseUrl}/chat/completions`;

  const systemPrompt = `
    You are an expert in learning science, specifically focused on Spaced Repetition and the Minimum Information Principle (SuperMemo 20 rules).
    Your task is to analyze Anki flashcards, explain concepts, critique the card design, and suggest improvements.
    
    Output JSON format only. The JSON must match this schema:
    {
      "explanation": "string (Detailed explanation in ${language})",
      "critique": "string (Critique of structure/atomicity in ${language})",
      "suggestions": [
        {
          "front": "string (HTML format for Anki front)",
          "back": "string (HTML format for Anki back)",
          "reason": "string (Why this is better, in ${language})"
        }
      ]
    }

    IMPORTANT:
    - For 'front' and 'back', use standard HTML tags (<b>, <i>, <br>, <ul>, <li>, <code>).
    - DO NOT use Markdown formatting in 'front' or 'back'.
  `;

  const userPrompt = `
    Analyze this card:
    FRONT: ${front}
    BACK: ${back}

    1. Explain the meaning in ${language}.
    2. Critique the card structure in ${language}.
    3. Suggest improved atomic versions.
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        // Add HTTP referer/title for OpenRouter (optional but good practice)
        "HTTP-Referer": window.location.origin,
        "X-Title": "Anki Refine" 
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Provider API Error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from API.");
    }

    return JSON.parse(content) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing card with OpenAI Compatible API:", error);
    throw error;
  }
};