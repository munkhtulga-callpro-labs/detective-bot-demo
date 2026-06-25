import { useCallback, useEffect, useRef, useState } from "react"
import { fetchExecutionTokens, fetchSceneImage, sendChat } from "@/lib/api"
import { generateCaseSeed, type CaseSeed } from "@/lib/case-seeder"
import { addUsage, estimateCostUsd, ZERO_USAGE, type TokenUsage } from "@/lib/cost"

const MAX_TURNS = 15

export type HistoryEntry = {
  turn: number
  query: string
  narrative: string
  imageUrl: string | null
  usage: TokenUsage
}

type GameState = {
  sessionId: string
  caseSeed: CaseSeed
  turn: number
  turnsRemaining: number
  narrative: string | null
  imageUrl: string | null
  history: HistoryEntry[]
  isSending: boolean
  error: string | null
  gameOver: boolean
  isSolved: boolean
  usage: TokenUsage
  costUsd: number
}

const initialState = (): GameState => ({
  sessionId: crypto.randomUUID(),
  caseSeed: generateCaseSeed(),
  turn: 0,
  turnsRemaining: MAX_TURNS,
  narrative: null,
  imageUrl: null,
  history: [],
  isSending: false,
  error: null,
  gameOver: false,
  isSolved: false,
  usage: ZERO_USAGE,
  costUsd: 0,
})

const revokeHistoryImages = (history: HistoryEntry[]) => {
  for (const entry of history) {
    if (entry.imageUrl) URL.revokeObjectURL(entry.imageUrl)
  }
}

export function useGameSession() {
  const [state, setState] = useState<GameState>(initialState)
  const lastQueryRef = useRef<string | null>(null)
  const historyRef = useRef<HistoryEntry[]>([])

  useEffect(() => {
    historyRef.current = state.history
  }, [state.history])

  useEffect(() => {
    return () => revokeHistoryImages(historyRef.current)
  }, [])

  const send = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return
      lastQueryRef.current = trimmed
      setState((s) => ({ ...s, isSending: true, error: null }))
      try {
        const sessionId = state.sessionId
        const res = await sendChat(sessionId, trimmed, state.caseSeed)
        // Image generation and the execution-detail token lookup are
        // independent — run them together. Both failures are non-fatal: the
        // turn still commits, image falls back to the previous one, and token
        // usage just isn't added for that turn.
        const [image, execTokens] = await Promise.all([
          res.image_generation_prompt
            ? fetchSceneImage(res.image_generation_prompt).catch((err) => {
                console.error("image fetch failed", err)
                return null
              })
            : Promise.resolve(null),
          res.execution_id
            ? fetchExecutionTokens(res.execution_id).catch((err) => {
                console.error("execution token fetch failed", err)
                return null
              })
            : Promise.resolve(null),
        ])
        const carriedImage = image?.url ?? null
        const turnUsage: TokenUsage = {
          chatInputTokens: execTokens?.promptTokens ?? 0,
          chatOutputTokens: execTokens?.completionTokens ?? 0,
          imageInputTokens: image?.inputTokens ?? 0,
          imageOutputTokens: image?.outputTokens ?? 0,
        }
        setState((s) => {
          const imageUrl = carriedImage ?? s.imageUrl
          const usage = addUsage(s.usage, turnUsage)
          const entry: HistoryEntry = {
            turn: res.turn_number,
            query: trimmed,
            narrative: res.output,
            imageUrl,
            usage: turnUsage,
          }
          return {
            ...s,
            narrative: res.output,
            turn: res.turn_number,
            turnsRemaining: res.turns_remaining,
            gameOver: res.game_over,
            isSolved: res.is_solved,
            imageUrl,
            history: [...s.history, entry],
            isSending: false,
            error: null,
            usage,
            costUsd: estimateCostUsd(usage),
          }
        })
      } catch (err) {
        console.error("chat failed", err)
        setState((s) => ({
          ...s,
          isSending: false,
          error: "Мөрдлөг тодорхойгүй байна... дахин оролдоорой.",
        }))
      }
    },
    [state.caseSeed, state.sessionId],
  )

  const retry = useCallback(() => {
    if (lastQueryRef.current) void send(lastQueryRef.current)
  }, [send])

  const reset = useCallback(() => {
    revokeHistoryImages(historyRef.current)
    lastQueryRef.current = null
    setState(initialState())
  }, [])

  return { state, send, retry, reset, maxTurns: MAX_TURNS }
}
