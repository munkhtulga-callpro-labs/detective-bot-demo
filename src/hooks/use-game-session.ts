import { useCallback, useEffect, useRef, useState } from "react"
import { fetchExecutionTokens, fetchSceneImage, sendChat } from "@/lib/api"
import { generateCaseSeed, type CaseSeed } from "@/lib/case-seeder"
import { addUsage, estimateCostUsd, ZERO_USAGE, type TokenUsage } from "@/lib/cost"
import type { LoadStatus } from "@/types"

const MAX_TURNS = 15

export type HistoryEntry = {
  id: string
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
  narrativeStatus: LoadStatus
  imageStatus: LoadStatus
  metricsStatus: LoadStatus
  error: string | null
  imageError: string | null
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
  narrativeStatus: "idle",
  imageStatus: "idle",
  metricsStatus: "idle",
  error: null,
  imageError: null,
  gameOver: false,
  isSolved: false,
  usage: ZERO_USAGE,
  costUsd: 0,
})

const revokeBlobUrls = (urls: Set<string>) => {
  for (const url of urls) URL.revokeObjectURL(url)
  urls.clear()
}

export function useGameSession({ trackCost }: { trackCost: boolean }) {
  const [state, setState] = useState<GameState>(initialState)
  const lastQueryRef = useRef<string | null>(null)
  const sendingRef = useRef(false)
  const blobUrlsRef = useRef<Set<string>>(new Set())
  const sessionEpochRef = useRef(0)
  const narrativeAbortRef = useRef<AbortController | null>(null)
  const latestImageRequestRef = useRef<string | null>(null)
  const unmountCleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // React 18 StrictMode mounts, cleans up, and remounts synchronously in
    // dev. Deferring the actual teardown by a tick lets a same-tick remount
    // cancel it below, so we only abort/revoke on a *real* unmount.
    if (unmountCleanupTimerRef.current !== null) {
      clearTimeout(unmountCleanupTimerRef.current)
      unmountCleanupTimerRef.current = null
    }
    return () => {
      unmountCleanupTimerRef.current = setTimeout(() => {
        sessionEpochRef.current++
        narrativeAbortRef.current?.abort()
        revokeBlobUrls(blobUrlsRef.current)
      }, 0)
    }
  }, [])

  const hydrateImage = useCallback(
    async ({
      entryId,
      sessionId,
      epoch,
      prompt,
    }: {
      entryId: string
      sessionId: string
      epoch: number
      prompt: string
    }) => {
      const requestId = crypto.randomUUID()
      latestImageRequestRef.current = requestId

      setState((s) =>
        s.sessionId === sessionId && epoch === sessionEpochRef.current
          ? { ...s, imageStatus: "loading", imageError: null }
          : s,
      )

      try {
        const image = await fetchSceneImage(prompt)
        if (epoch !== sessionEpochRef.current) return
        blobUrlsRef.current.add(image.url)

        const isCurrent = requestId === latestImageRequestRef.current
        const turnUsage: TokenUsage = {
          chatInputTokens: 0,
          chatOutputTokens: 0,
          imageInputTokens: image.inputTokens,
          imageOutputTokens: image.outputTokens,
        }

        setState((s) => {
          if (s.sessionId !== sessionId) return s
          const usage = addUsage(s.usage, turnUsage)
          const history = s.history.map((entry) =>
            entry.id === entryId
              ? { ...entry, imageUrl: image.url, usage: addUsage(entry.usage, turnUsage) }
              : entry,
          )
          return {
            ...s,
            imageUrl: isCurrent ? image.url : s.imageUrl,
            imageStatus: isCurrent ? "idle" : s.imageStatus,
            history,
            usage,
            costUsd: estimateCostUsd(usage),
          }
        })
      } catch (err) {
        console.error("image fetch failed", err)
        if (epoch !== sessionEpochRef.current) return
        setState((s) =>
          s.sessionId === sessionId
            ? {
                ...s,
                imageStatus:
                  requestId === latestImageRequestRef.current ? "error" : s.imageStatus,
                imageError: "Дүрс үүсгэхэд алдаа гарлаа.",
              }
            : s,
        )
      }
    },
    [],
  )

  const hydrateUsage = useCallback(
    async ({
      entryId,
      sessionId,
      epoch,
      executionId,
    }: {
      entryId: string
      sessionId: string
      epoch: number
      executionId: string
    }) => {
      setState((s) =>
        s.sessionId === sessionId && epoch === sessionEpochRef.current
          ? { ...s, metricsStatus: "loading" }
          : s,
      )

      try {
        const tokens = await fetchExecutionTokens(executionId)
        if (epoch !== sessionEpochRef.current) return

        const turnUsage: TokenUsage = {
          chatInputTokens: tokens.promptTokens,
          chatOutputTokens: tokens.completionTokens,
          imageInputTokens: 0,
          imageOutputTokens: 0,
        }

        setState((s) => {
          if (s.sessionId !== sessionId) return s
          const usage = addUsage(s.usage, turnUsage)
          const history = s.history.map((entry) =>
            entry.id === entryId
              ? { ...entry, usage: addUsage(entry.usage, turnUsage) }
              : entry,
          )
          return { ...s, history, usage, costUsd: estimateCostUsd(usage), metricsStatus: "idle" }
        })
      } catch (err) {
        console.error("execution token fetch failed", err)
        if (epoch !== sessionEpochRef.current) return
        setState((s) => (s.sessionId === sessionId ? { ...s, metricsStatus: "error" } : s))
      }
    },
    [],
  )

  const send = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return
      if (sendingRef.current) return
      sendingRef.current = true

      const sessionId = state.sessionId
      const caseSeed = state.caseSeed
      const epoch = sessionEpochRef.current
      const firstTurn = state.turn === 0
      lastQueryRef.current = trimmed

      const controller = new AbortController()
      narrativeAbortRef.current = controller

      setState((s) => ({ ...s, narrativeStatus: "loading", error: null }))

      try {
        const response = await sendChat(
          sessionId,
          trimmed,
          firstTurn ? caseSeed : undefined,
          controller.signal,
        )

        if (epoch !== sessionEpochRef.current) return

        const entryId = crypto.randomUUID()
        setState((s) => {
          if (s.sessionId !== sessionId) return s
          const entry: HistoryEntry = {
            id: entryId,
            turn: response.turn_number,
            query: trimmed,
            narrative: response.output,
            imageUrl: s.imageUrl,
            usage: ZERO_USAGE,
          }
          return {
            ...s,
            narrative: response.output,
            turn: response.turn_number,
            turnsRemaining: response.turns_remaining,
            gameOver: response.game_over,
            isSolved: response.is_solved,
            history: [...s.history, entry],
            narrativeStatus: "idle",
            error: null,
          }
        })

        if (response.image_generation_prompt) {
          void hydrateImage({
            entryId,
            sessionId,
            epoch,
            prompt: response.image_generation_prompt,
          })
        }
        if (trackCost && response.execution_id) {
          void hydrateUsage({ entryId, sessionId, epoch, executionId: response.execution_id })
        }
      } catch (err) {
        if (epoch !== sessionEpochRef.current) return
        if (err instanceof DOMException && err.name === "AbortError") return
        console.error("chat failed", err)
        setState((s) =>
          s.sessionId === sessionId
            ? {
                ...s,
                narrativeStatus: "error",
                error: "Мөрдлөг тодорхойгүй байна... дахин оролдоорой.",
              }
            : s,
        )
      } finally {
        sendingRef.current = false
      }
    },
    [state.sessionId, state.caseSeed, state.turn, trackCost, hydrateImage, hydrateUsage],
  )

  const retry = useCallback(() => {
    if (lastQueryRef.current) void send(lastQueryRef.current)
  }, [send])

  const reset = useCallback(() => {
    if (unmountCleanupTimerRef.current !== null) {
      clearTimeout(unmountCleanupTimerRef.current)
      unmountCleanupTimerRef.current = null
    }
    sessionEpochRef.current++
    narrativeAbortRef.current?.abort()
    narrativeAbortRef.current = null
    latestImageRequestRef.current = null
    sendingRef.current = false
    revokeBlobUrls(blobUrlsRef.current)
    lastQueryRef.current = null
    setState(initialState())
  }, [])

  return { state, send, retry, reset, maxTurns: MAX_TURNS }
}
