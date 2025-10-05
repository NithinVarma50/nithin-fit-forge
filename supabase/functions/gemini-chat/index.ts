// deno-lint-ignore-file no-explicit-any
// @ts-ignore: Deno runtime import for Supabase Edge Functions
// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const OPENROUTER_API_KEY = Deno.env.get('GEMINI_API_KEY');
    console.log('OPENROUTER_API_KEY exists:', !!OPENROUTER_API_KEY);
    console.log('OPENROUTER_API_KEY length:', OPENROUTER_API_KEY?.length);
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const payload = {
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'user', content: prompt }
      ]
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content;

    if (text) {
      return new Response(
        JSON.stringify({ text }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error("No content received from Gemini API.");
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
