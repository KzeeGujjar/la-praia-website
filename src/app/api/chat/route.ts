import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";

export const runtime = "nodejs";

const client = new Anthropic();

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

type IncomingMessage = { role: "user" | "assistant"; content: string };

function isValidHistory(value: unknown): value is IncomingMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= MAX_MESSAGES &&
    value.every(
      (m) =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= MAX_MESSAGE_LENGTH,
    )
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!isValidHistory(messages)) {
    return new Response("Invalid request", { status: 400 });
  }

  const stream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: await buildSystemPrompt(),
    messages,
  });

  const encoder = new TextEncoder();
  const body_ = new ReadableStream({
    start(controller) {
      let settled = false;
      stream.on("text", (text) => controller.enqueue(encoder.encode(text)));
      stream.on("end", () => {
        if (settled) return;
        settled = true;
        controller.close();
      });
      stream.on("error", (err) => {
        if (settled) return;
        settled = true;
        console.error("Chat stream error:", err);
        controller.error(err);
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body_, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
