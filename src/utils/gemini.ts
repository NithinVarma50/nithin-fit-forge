const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const GEMINI_API_KEY = 'AIzaSyAKT9YxRmVomgiZS2B3Pq3CN5YyRaBKmq4';

export async function callGeminiAPI(prompt: string): Promise<string> {
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return text;
    } else {
      throw new Error("No content received from Gemini API.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}
