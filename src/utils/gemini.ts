import { supabase } from "@/integrations/supabase/client";

export async function callGeminiAPI(prompt: string): Promise<string> {
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
