import { supabase } from "@/integrations/supabase/client";
import { parseAIContent } from "./aiParser";

export async function callGeminiAPI(prompt: string, contentHint?: string): Promise<string | any> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { prompt }
    });

    if (error) {
      console.error("Gemini API call failed:", error);
      throw new Error(error.message || "Failed to call Gemini API");
    }

    if (data?.text) {
      // Parse the AI response into structured data if possible
      const structuredData = parseAIContent(data.text, contentHint);
      return structuredData;
    } else {
      throw new Error("No content received from Gemini API.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}

// For backward compatibility with components that expect string responses
export async function callGeminiAPIRaw(prompt: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { prompt }
    });

    if (error) {
      console.error("Gemini API call failed:", error);
      throw new Error(error.message || "Failed to call Gemini API");
    }

    if (data?.text) {
      return data.text;
    } else {
      throw new Error("No content received from Gemini API.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}
