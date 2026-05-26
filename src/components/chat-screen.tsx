import { useEffect, useState } from "react"
import { useGameSession } from "@/hooks/use-game-session"
import { SceneImage } from "@/components/scene-image"
import { ChatInput } from "@/components/chat-input"
import { GameOverDialog } from "@/components/game-over-dialog"
import { Button } from "@/components/ui/button"

const LOADING_HINTS = [
  "Газрыг шинж. Гэрчээс асуу. Мөрийг хөө.",
  "Бэлэн болоод &ldquo;Би [нэр]-ийг буруутгаж байна&rdquo; гэж хэлээрэй.",
  "Жижиг мэдээлэл ч чухал, мөгдөгчөө.",
  "Зөн совиндоо итгэ &mdash; гэхдээ нотлох баримтыг шалга.",
]

export function ChatScreen({ onQuit }: { onQuit: () => void }) {
  const { state, send, retry, reset, maxTurns } = useGameSession()
  const [gameOverOpen, setGameOverOpen] = useState(false)
  const [narrativeKey, setNarrativeKey] = useState(0)
  const [hintIndex, setHintIndex] = useState(0)

  useEffect(() => {
    if (state.gameOver) setGameOverOpen(true)
  }, [state.gameOver])

  useEffect(() => {
    if (state.narrative) setNarrativeKey((k) => k + 1)
  }, [state.narrative])

  useEffect(() => {
    if (!state.isSending) return
    setHintIndex(Math.floor(Math.random() * LOADING_HINTS.length))
    const id = setInterval(() => {
      setHintIndex((i) => (i + 1) % LOADING_HINTS.length)
    }, 3500)
    return () => clearInterval(id)
  }, [state.isSending])

  const displayTurn = Math.min(state.turn || 1, maxTurns)

  return (
    <div className="flex h-full w-full flex-col bg-noir-bg text-noir-cream">
      <header className="flex items-center justify-between border-b border-noir-border bg-noir-surface/80 px-4 pb-3 pt-12 backdrop-blur-md md:pt-6">
        <span className="font-serif text-sm tracking-wide text-noir-amber">
          Асуулт {displayTurn} / {maxTurns}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onQuit}
          className="h-8 px-3 text-xs uppercase tracking-[0.2em] text-noir-cream/70 hover:bg-noir-danger/20 hover:text-noir-cream"
        >
          Гарах
        </Button>
      </header>

      <SceneImage url={state.imageUrl} isLoading={state.isSending} />

      <div className="relative flex-1 overflow-y-auto px-5 py-5">
        {state.isSending ? (
          <div
            key={hintIndex}
            className="flex animate-[fadeUp_400ms_ease-out] flex-col items-center gap-4 pt-4 text-center"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-noir-amber" />
              <span className="h-2 w-2 animate-[pulse_1.2s_ease-in-out_0.2s_infinite] rounded-full bg-noir-amber" />
              <span className="h-2 w-2 animate-[pulse_1.2s_ease-in-out_0.4s_infinite] rounded-full bg-noir-amber" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-noir-amber/80">
              Мөрдөж байна
            </p>
            <p
              className="max-w-70 font-serif text-[15px] italic leading-[1.7] text-noir-cream/70"
              dangerouslySetInnerHTML={{ __html: LOADING_HINTS[hintIndex] }}
            />
          </div>
        ) : state.narrative ? (
          <p
            key={narrativeKey}
            className="animate-[fadeUp_400ms_ease-out] font-serif text-[15px] leading-[1.7] text-noir-cream"
          >
            {state.narrative}
          </p>
        ) : (
          <div className="space-y-3 font-serif text-[15px] leading-[1.7] text-noir-cream/80">
            <p className="italic text-noir-amber">
              Хэрэг шинэхэн. Шөнө таных.
            </p>
            <p>
              Юу хийхээ хэлээрэй, мөгдөгчөө &mdash; газрыг шинж, гэрчээс
              асуу, эсвэл сэжгээ хөө.
            </p>
          </div>
        )}

        {state.error && !state.isSending && (
          <div className="mt-4 rounded-md border border-noir-danger/40 bg-noir-danger/10 p-3">
            <p className="text-sm text-noir-cream/90">{state.error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={retry}
              className="mt-2 h-7 border-noir-danger/40 bg-transparent text-xs text-noir-cream hover:bg-noir-danger/20 hover:text-noir-cream"
            >
              Дахин оролдох
            </Button>
          </div>
        )}
      </div>

      <ChatInput
        disabled={state.isSending || state.gameOver}
        onSubmit={send}
      />

      <GameOverDialog
        open={gameOverOpen}
        isSolved={state.isSolved}
        imageUrl={state.imageUrl}
        onNewCase={() => {
          setGameOverOpen(false)
          reset()
        }}
        onClose={() => {
          setGameOverOpen(false)
          onQuit()
        }}
      />
    </div>
  )
}
