import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ message: z.string().min(2) });

const systemPrompt = `You are Broker 4.0 AI consultant for SMEs. Ask concise follow-up questions to structure project brief. Return practical suggestions with this format:\n1) Problem summary\n2) Recommended solutions\n3) Suggested budget range\n4) Suggested timeline\n5) Data required\nKeep answers in Vietnamese.`;

export async function POST(request: Request) {
  const body = await request.json();
  const { message } = schema.parse(body);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is missing." }, { status: 500 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_BASE_URL ?? "http://localhost:3000",
      "X-Title": "Broker 4.0",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: await response.text() }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ content: data?.choices?.[0]?.message?.content ?? "AI chua tr? l?i." });
}
