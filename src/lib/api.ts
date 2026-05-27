import type { ChatResponse } from "@/types"
import type { CaseSeed } from "@/lib/case-seeder"

const CHAT_URL =
  "https://n8n.onlime.mn/webhook/lime/v2/challenge/detective/chat"
const IMAGE_URL =
  "https://n8n.onlime.mn/webhook/lime/v2/challenge/detective/generate-image"

export async function sendChat(
  sessionId: string,
  query: string,
  caseSeed: CaseSeed,
): Promise<ChatResponse> {
  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, query, caseSeed }),
  })
  if (!res.ok) throw new Error(`chat ${res.status}`)
  const data = (await res.json()) as ChatResponse | { output: ChatResponse }
  // n8n wraps the LLM tool result under an extra `output` key.
  return "output" in data && typeof data.output === "object"
    ? (data.output as ChatResponse)
    : (data as ChatResponse)
}

export async function fetchSceneImage(prompt: string): Promise<string> {
  const res = await fetch(IMAGE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_generation_prompt: prompt }),
  })
  if (!res.ok) throw new Error(`image ${res.status}`)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
