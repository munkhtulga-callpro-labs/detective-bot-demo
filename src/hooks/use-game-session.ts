import { useCallback, useEffect, useRef, useState } from "react"
import { fetchSceneImage, sendChat } from "@/lib/api"

const MAX_TURNS = 15

type GameState = {
  sessionId: string
  turn: number
  turnsRemaining: number
  narrative: string | null
  imageUrl: string | null
  isSending: boolean
  error: string | null
  gameOver: boolean
  isSolved: boolean
}

const initialState = (): GameState => ({
  sessionId: crypto.randomUUID(),
  turn: 0,
  turnsRemaining: MAX_TURNS,
  narrative: null,
  imageUrl: null,
  isSending: false,
  error: null,
  gameOver: false,
  isSolved: false,
})

export function useGameSession() {
  const [state, setState] = useState<GameState>(initialState)
  const lastQueryRef = useRef<string | null>(null)
  const imageUrlRef = useRef<string | null>(null)

  useEffect(() => {
    imageUrlRef.current = state.imageUrl
  }, [state.imageUrl])

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    }
  }, [])

  const send = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return
      lastQueryRef.current = trimmed
      setState((s) => ({ ...s, isSending: true, error: null }))
      try {
        const sessionId = state.sessionId
        const res = await sendChat(sessionId, trimmed)
        let nextImageUrl: string | null = null
        if (res.image_generation_prompt) {
          try {
            nextImageUrl = await fetchSceneImage(res.image_generation_prompt)
          } catch (err) {
            console.error("image fetch failed", err)
          }
        }
        setState((s) => {
          if (nextImageUrl && s.imageUrl) URL.revokeObjectURL(s.imageUrl)
          return {
            ...s,
            narrative: res.output,
            turn: res.turn_number,
            turnsRemaining: res.turns_remaining,
            gameOver: res.game_over,
            isSolved: res.is_solved,
            imageUrl: nextImageUrl ?? s.imageUrl,
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
    [state.sessionId],
  )

  const retry = useCallback(() => {
    if (lastQueryRef.current) void send(lastQueryRef.current)
  }, [send])

  const reset = useCallback(() => {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    lastQueryRef.current = null
    setState(initialState())
  }, [])

  return { state, send, retry, reset, maxTurns: MAX_TURNS }
}
