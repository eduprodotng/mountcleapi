import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is set
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 30000); // Exponential backoff
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// General function to call OpenAI with retries
export async function callOpenAI(
  messages,
  maxTokens = 1000,
  temperature = 0.7
) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await waitForRetry(attempt);
      } else {
        console.error("OpenAI Error:", error);
        throw new Error("OpenAI API call failed");
      }
    }
  }
  throw new Error("Max retries exceeded");
}
