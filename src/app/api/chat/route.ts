import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use Gemini 2.5 Flash to bypass rate limit of 2.0
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format chat history for Gemini SDK
    // Gemini uses "user" and "model" roles instead of "user" and "assistant"
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // For better standard conversational ability, let's use generateContentStream
    const result = await model.generateContentStream({
      contents,
      systemInstruction: {
        role: "system",
        parts: [{ text: "You are Grok, an AI built into TheJoblessPeoples. You have a rebellious streak, you're witty, and you love answering questions about technology, jobs, and the platform. You provide direct and intelligent answers with a touch of humor." }]
      }
    });

    let text = "";
    for await (const chunk of result.stream) {
      text += chunk.text();
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to communicate with AI", details: error.message },
      { status: 500 }
    );
  }
}
