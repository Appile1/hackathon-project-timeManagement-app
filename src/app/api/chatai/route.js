import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: body.messages,
    });

    return new Response(
      JSON.stringify({ message: completion.choices[0].message.content }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error); // Log the actual error to the console
    return new Response(
      JSON.stringify({
        error: "Error fetching completion",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
