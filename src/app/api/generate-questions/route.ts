import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates multiple-choice questions based on given text.",
        },
        {
          role: "user",
          content: `Generate 5 multiple-choice questions from the following text. Each question should have 4 options, and one should be marked as the correct answer. If the content doesn't lend itself to multiple-choice questions, generate true/false questions instead. Format the output as a JSON array of question objects.\n\nText: ${text}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const questions = JSON.parse(response.choices[0].message.content || "[]");
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
