/**
 * One end-to-end OpenRouter chat completion using the official SDK.
 *
 * Usage:
 *   export OPENROUTER_API_KEY=sk-or-...        # create one at https://openrouter.ai/keys
 *   npm run ask -- "Your prompt here"
 *
 * Optional: OPENROUTER_MODEL=<slug> picks another model (see https://openrouter.ai/models).
 */
import { OpenRouter } from "@openrouter/sdk";
import {
  ConnectionError,
  OpenRouterError,
  RequestTimeoutError,
} from "@openrouter/sdk/models/errors";

const DEFAULT_MODEL = "anthropic/claude-opus-5.5";

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) {
    console.error(
      "OPENROUTER_API_KEY is not set.\n" +
        "Create a key at https://openrouter.ai/keys, then run:\n" +
        "  export OPENROUTER_API_KEY=sk-or-...",
    );
    process.exit(1);
  }
  return key;
}

export function createClient(apiKey = getApiKey()): OpenRouter {
  return new OpenRouter({
    apiKey,
    appTitle: "silver-lamp",
    timeoutMs: 60_000,
    // Retry 429/5xx and network failures with backoff, but give up after 30s total.
    retryConfig: {
      strategy: "backoff",
      backoff: { initialInterval: 500, maxInterval: 5_000, exponent: 1.5, maxElapsedTime: 30_000 },
      retryConnectionErrors: true,
    },
  });
}

export async function ask(
  client: OpenRouter,
  prompt: string,
  model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
): Promise<string> {
  const result = await client.chat.send(
    {
      chatRequest: {
        model,
        messages: [{ role: "user", content: prompt }],
      },
    },
  );

  const content = result.choices[0]?.message.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => ("text" in part && typeof part.text === "string" ? part.text : ""))
      .join("");
  }
  throw new Error(`Model ${model} returned no text content.`);
}

function describeError(err: unknown): string {
  if (err instanceof OpenRouterError) {
    const hints: Record<number, string> = {
      401: "Invalid or missing API key — check OPENROUTER_API_KEY.",
      402: "Insufficient credits — add credits at https://openrouter.ai/settings/credits.",
      404: "Model not found — check the slug at https://openrouter.ai/models.",
      429: "Rate limited — wait and retry.",
    };
    const hint = hints[err.statusCode] ?? "";
    return `OpenRouter API error ${err.statusCode}: ${err.message}${hint ? `\n${hint}` : ""}\n${err.body}`;
  }
  if (err instanceof RequestTimeoutError) return "Request timed out (60s per attempt).";
  if (err instanceof ConnectionError) return `Could not reach OpenRouter: ${err.message}`;
  return err instanceof Error ? err.message : String(err);
}

async function main() {
  const prompt = process.argv.slice(2).join(" ") || "Say hello in one short sentence.";
  const client = createClient();
  try {
    console.log(await ask(client, prompt));
  } catch (err) {
    console.error(describeError(err));
    process.exit(1);
  }
}

main();
