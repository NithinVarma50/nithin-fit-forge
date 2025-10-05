import { supabase } from "@/integrations/supabase/client";
import { parseAIContent } from "./aiParser";

export async function callGeminiAPI(prompt: string, contentHint?: string): Promise<string | any> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { prompt, type: contentHint || 'general' }
    });

    if (error) {
      console.error("AI API call failed:", error);
      throw new Error(error.message || "Failed to call AI service");
    }

    if (data?.text) {
      // Parse the AI response into structured data if possible
      const structuredData = parseAIContent(data.text, contentHint);
      return structuredData;
    } else if (data?.error) {
      throw new Error(data.error);
    } else {
      throw new Error("No content received from AI service");
    }
  } catch (error) {
    console.error("AI API call failed:", error);
    throw error;
  }
}

// For backward compatibility with components that expect string responses
export async function callGeminiAPIRaw(prompt: string, messages?: Array<{ role: string; content: string }>): Promise<string> {
  try {
    const requestBody = messages 
      ? { messages, systemPrompt: prompt, type: 'chat' }
      : { prompt, type: 'simple' };

    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: requestBody
    });

    if (error) {
      console.error("AI API call failed:", error);
      throw new Error(error.message || "Failed to call AI service");
    }

    if (data?.text) {
      return data.text;
    } else if (data?.error) {
      throw new Error(data.error);
    } else {
      throw new Error("No content received from AI service");
    }
  } catch (error) {
    console.error("AI API call failed:", error);
    throw error;
  }
}
