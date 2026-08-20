import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { getAdminFromRequest } from "@/lib/auth";

type Action = "continue" | "lengthen" | "refine" | "tone" | "generate";
type Provider = "anthropic" | "openai";

interface RequestBody {
  action: Action;
  provider: Provider;
  /** Selected text for lengthen/refine/tone, the full draft for continue, or the brief for generate. */
  text: string;
  /** Extra surrounding context (e.g. the rest of the post) to keep voice consistent. */
  context?: string;
  /** Required when action is "tone". */
  tone?: string;
  /** Optional context for "generate" — the post's title/category, if already set. */
  title?: string;
  category?: string;
}

const SYSTEM_PROMPT = `You are a ghostwriter helping edit a software engineer's personal blog. You are given a snippet of an article and an editing instruction. Rewrite or extend the snippet as instructed, matching the article's existing voice and technical register.

Rules:
- Return ONLY the resulting prose — no preamble, no explanation, no markdown headers, no quotation marks around the output.
- Separate paragraphs with a blank line.
- Do not restate or repeat text that wasn't asked for.`;

const GENERATE_SYSTEM_PROMPT = `You are a ghostwriter writing a full article for a software engineer's personal blog, from a short brief. Write in a clear, direct, technical voice — no fluff, no generic intros like "In today's world...".

Rules:
- Return ONLY a self-contained HTML fragment for the article body — no <html>/<head>/<body> wrapper, no markdown, no code fences, no commentary.
- Use only these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <a href="...">, <code>.
- Do not include a top-level <h1> — the title is rendered separately.
- Structure it with a few <h2>/<h3> section headings where it helps readability.
- Aim for roughly 600-1000 words unless the brief asks for something shorter or longer.`;

function buildPrompt(body: RequestBody): string {
  const { action, text, context, tone, title, category } = body;

  switch (action) {
    case "continue":
      return `Here is the article so far:\n\n${text}\n\nContinue writing the next 2-3 paragraphs in the same voice and direction.`;
    case "lengthen":
      return `${context ? `Article context:\n${context}\n\n` : ""}Expand and elaborate on this passage — roughly double its length, add supporting detail or examples, without changing its meaning:\n\n${text}`;
    case "refine":
      return `${context ? `Article context:\n${context}\n\n` : ""}Improve the clarity, flow, and grammar of this passage. Keep roughly the same length and meaning:\n\n${text}`;
    case "tone":
      return `${context ? `Article context:\n${context}\n\n` : ""}Rewrite this passage in a ${tone} tone. Keep roughly the same length and meaning:\n\n${text}`;
    case "generate":
      return `${title ? `Working title: ${title}\n` : ""}${category ? `Category: ${category}\n` : ""}Brief: ${text}\n\nWrite the article body now.`;
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { action, provider, text } = body;
  if (!action || !provider || !text?.trim()) {
    return NextResponse.json({ error: "action, provider and text are required" }, { status: 400 });
  }
  if (action === "tone" && !body.tone) {
    return NextResponse.json({ error: "tone is required for the tone action" }, { status: 400 });
  }

  const prompt = buildPrompt(body);
  const systemPrompt = action === "generate" ? GENERATE_SYSTEM_PROMPT : SYSTEM_PROMPT;
  const maxTokens = action === "generate" ? 8192 : 4096;

  try {
    if (provider === "anthropic") {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
      }
      const client = new Anthropic();
      const response = await client.messages.create({
        model: "claude-opus-5",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      });
      const result = response.content.find((b) => b.type === "text")?.text ?? "";
      return NextResponse.json({ result: result.trim() });
    }

    if (provider === "openai") {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
      }
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      });
      const result = response.choices[0]?.message?.content ?? "";
      return NextResponse.json({ result: result.trim() });
    }

    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  } catch (err: unknown) {
    console.error("[admin ai-writing POST]", err);
    const msg = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
