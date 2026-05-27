import { useCallback, useEffect, useRef, useState } from "react"
import { fetchSceneImage, sendChat } from "@/lib/api"
import { generateCaseSeed, type CaseSeed } from "@/lib/case-seeder"

const MAX_TURNS = 15

export type HistoryEntry = {
  turn: number
  query: string
  narrative: string
  imageUrl: string | null
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
        let nextImageUrl: string | null = null
        if (res.image_generation_prompt) {
          try {
            nextImageUrl = await fetchSceneImage(res.image_generation_prompt)
          } catch (err) {
            console.error("image fetch failed", err)
          }
        }
        const carriedImage = nextImageUrl
        setState((s) => {
          const imageUrl = carriedImage ?? s.imageUrl
          const entry: HistoryEntry = {
            turn: res.turn_number,
            query: trimmed,
            narrative: res.output,
            imageUrl,
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
