// Token accounting + cost estimation for a game session.
//
// Two Azure OpenAI models are billed:
//   - chat:  gpt-5.4-mini      (the n8n detective agent + any sub-agents)
//   - image: gpt-image-1-mini  (scene image generation)
//
// Chat token usage is read from the n8n execution-detail endpoint (summed
// across every LLM node run). Image token usage comes back inline with the
// image response (`usage.input_tokens` / `usage.output_tokens`).

export type TokenUsage = {
  chatInputTokens: number
  chatOutputTokens: number
  imageInputTokens: number
  imageOutputTokens: number
}

export const ZERO_USAGE: TokenUsage = {
  chatInputTokens: 0,
  chatOutputTokens: 0,
  imageInputTokens: 0,
  imageOutputTokens: 0,
}

// ─── PRICING ────────────────────────────────────────────────────────────────
// USD per 1,000,000 tokens (Azure OpenAI).
// NOTE: cached-input discounts (chat $0.08/1M, image text $0.20/1M, image
// image-input $0.25/1M) are NOT applied — neither the execution-detail
// endpoint nor the image response breaks out cached vs uncached tokens, so we
// price everything at the standard (uncached) rate. This slightly overestimates
// cost when prompt caching kicks in.
const PRICING = {
  chat: {
    // gpt-5.4-mini
    input: 0.75, // standard input
    output: 4.5, // standard output
  },
  image: {
    // gpt-image-1-mini — input_tokens are text input; output_tokens are image
    input: 2.0, // input text
    output: 8.0, // output image
  },
} as const
// ─────────────────────────────────────────────────────────────────────────────

const PER_TOKEN = 1_000_000

export function addUsage(a: TokenUsage, b: TokenUsage): TokenUsage {
  return {
    chatInputTokens: a.chatInputTokens + b.chatInputTokens,
    chatOutputTokens: a.chatOutputTokens + b.chatOutputTokens,
    imageInputTokens: a.imageInputTokens + b.imageInputTokens,
    imageOutputTokens: a.imageOutputTokens + b.imageOutputTokens,
  }
}

export function estimateCostUsd(u: TokenUsage): number {
  return (
    (u.chatInputTokens * PRICING.chat.input +
      u.chatOutputTokens * PRICING.chat.output +
      u.imageInputTokens * PRICING.image.input +
      u.imageOutputTokens * PRICING.image.output) /
    PER_TOKEN
  )
}
