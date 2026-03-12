import { useState } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatAssistantProps {
  context: Record<string, unknown>;
}

const ChatAssistant = ({ context }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      console.error(e);
      setError("Something went wrong talking to the assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl rounded-2xl border bg-card px-7 py-6 shadow-md">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <p className="text-base font-semibold tracking-tight text-foreground">
              FryGuyAI
            </p>
            <p className="text-sm text-muted-foreground">
              Ask about this dashboard&apos;s loads, divisions, and states.
            </p>
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto space-y-2 mb-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "text-foreground"
                : "text-muted-foreground border-l-2 pl-3 border-border"
            }
          >
            <span className="font-semibold mr-1">
              {m.role === "user" ? "You" : "FryGuyAI"}:
            </span>
            <span>{m.content}</span>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Try asking: &quot;Which states have the most uncovered loads right now?&quot;
          </p>
        )}
        </div>
        <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          rows={3}
          placeholder="Ask a question about this dashboard..."
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-60"
        >
          {loading ? "Thinking…" : "Send"}
        </button>
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
};

export default ChatAssistant;

