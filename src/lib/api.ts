import type { ChatResponse } from "@/types"
import type { CaseSeed } from "@/lib/case-seeder"

const CHAT_URL =
  "https://n8n.onlime.mn/webhook/lime/v2/challenge/detective/chat"
const IMAGE_URL =
  "https://n8n.onlime.mn/webhook/lime/v2/challenge/detective/generate-image"
const EXECUTION_URL =
  "https://n8n.onlime.mn/webhook/8674ea39-e790-485c-b90b-861a7cf630f7"

export async function sendChat(
  sessionId: string,
  query: string,
  caseSeed?: CaseSeed,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  const body = caseSeed ? { sessionId, query, caseSeed } : { sessionId, query }
  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  })
  if (!res.ok) throw new Error(`chat ${res.status}`)
  const data = await res.json()
  // n8n now returns a single-element array: [{ output: {...}, execution_id }].
  // Older shape was the bare object, optionally wrapped in an extra `output`.
  const item = Array.isArray(data) ? data[0] : data
  // execution_id lives on the outer wrapper alongside `output`; carry it in.
  const execution_id = item?.execution_id as string | undefined
  const output =
    "output" in item && typeof item.output === "object"
      ? (item.output as ChatResponse)
      : (item as ChatResponse)
  return { ...output, execution_id: output.execution_id ?? execution_id }
}

type ImageResponseItem = {
  data?: { b64_json?: string }[]
  output_format?: string
  usage?: { input_tokens?: number; output_tokens?: number }
}

export type SceneImage = {
  url: string
  inputTokens: number
  outputTokens: number
}

function b64ToBlob(b64: string, mime: string): Blob {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export async function fetchSceneImage(
  prompt: string,
  signal?: AbortSignal,
): Promise<SceneImage> {
  const res = await fetch(IMAGE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_generation_prompt: prompt }),
    signal,
  })
  if (!res.ok) throw new Error(`image ${res.status}`)
  // The endpoint now returns JSON (OpenAI-style) instead of a binary PNG:
  // [{ data: [{ b64_json: "..." }], output_format: "png", usage: {...} }].
  const data = (await res.json()) as ImageResponseItem[] | ImageResponseItem
  const item = Array.isArray(data) ? data[0] : data
  const b64 = item?.data?.[0]?.b64_json
  if (!b64) throw new Error("image response missing b64_json")
  const mime = `image/${item.output_format ?? "png"}`
  return {
    url: URL.createObjectURL(b64ToBlob(b64, mime)),
    inputTokens: item.usage?.input_tokens ?? 0,
    outputTokens: item.usage?.output_tokens ?? 0,
  }
}

// ── Execution detail → chat token usage ──────────────────────────────────────
// GET <EXECUTION_URL>?id=<executionId> returns the full n8n execution. We sum
// tokenUsage across every LLM node run (the dispatcher agent + any sub-agent).
type LangModelItem = { json?: { tokenUsage?: { promptTokens?: number; completionTokens?: number } } }
type NodeRun = { data?: { ai_languageModel?: LangModelItem[][] } }
type ExecutionDetail = {
  data?: { resultData?: { runData?: Record<string, NodeRun[]> } }
}

export async function fetchExecutionTokens(
  executionId: string,
  signal?: AbortSignal,
): Promise<{ promptTokens: number; completionTokens: number }> {
  const res = await fetch(`${EXECUTION_URL}?id=${encodeURIComponent(executionId)}`, {
    signal,
  })
  if (!res.ok) throw new Error(`execution ${res.status}`)
  const data = (await res.json()) as ExecutionDetail[] | ExecutionDetail
  const item = Array.isArray(data) ? data[0] : data
  const runData = item?.data?.resultData?.runData ?? {}

  let promptTokens = 0
  let completionTokens = 0
  for (const runs of Object.values(runData)) {
    for (const run of runs ?? []) {
      for (const outputs of run?.data?.ai_languageModel ?? []) {
        for (const o of outputs ?? []) {
          const usage = o?.json?.tokenUsage
          if (!usage) continue
          promptTokens += usage.promptTokens ?? 0
          completionTokens += usage.completionTokens ?? 0
        }
      }
    }
  }
  return { promptTokens, completionTokens }
}
