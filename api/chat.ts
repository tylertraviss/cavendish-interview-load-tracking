import type { VercelRequest, VercelResponse } from "@vercel/node";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set on the server" });
  }

  try {
    const { messages, context } = req.body as {
      messages: ChatMessage[];
      context?: Record<string, unknown>;
    };

    const narrativeText =
      typeof context === "object" && context !== null && "narrative" in context
        ? String((context as { narrative?: unknown }).narrative ?? "")
        : "";

    const compactNarrative = narrativeText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" | ");

    const limitedMessages = (messages ?? []).slice(-6);

    const systemPrompt =
      "You are an assistant embedded in a transportation load-tracking dashboard. " +
      "Answer concisely. Use only the provided context. If something is not in the context, say you are not sure.\n\n" +
      (compactNarrative ? `Context: ${compactNarrative}` : "Context: (none provided)");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "system", content: systemPrompt }, ...limitedMessages],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return res.status(500).json({ error: "Failed to call OpenAI API" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
