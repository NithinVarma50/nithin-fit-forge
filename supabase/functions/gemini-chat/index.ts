import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, messages, systemPrompt, type } = await req.json();

    if (!prompt && !messages) {
      throw new Error("Either prompt or messages is required");
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error("AI service is not configured");
    }

    // Build messages array based on input
    let aiMessages = [];
    
    if (messages && Array.isArray(messages)) {
      // Chat mode with conversation history
      aiMessages = messages;
    } else if (prompt) {
      // Simple prompt mode
      aiMessages = [{ role: 'user', content: prompt }];
    }

    // Add system prompt if provided
    if (systemPrompt) {
      aiMessages.unshift({ role: 'system', content: systemPrompt });
    }

    const payload = {
      model: 'google/gemini-2.5-flash',
      messages: aiMessages
    };

    console.log('Calling Lovable AI with type:', type || 'general');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits depleted. Please add credits to continue.");
      }
      
      throw new Error(`AI service error: ${response.status}`);
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
      console.error('No content in AI response:', result);
      throw new Error("No content received from AI service");
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Edge function error:', errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
