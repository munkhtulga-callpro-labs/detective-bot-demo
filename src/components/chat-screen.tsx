import { useEffect, useRef, useState } from "react"
import { BookOpen } from "lucide-react"
import { useGameSession } from "@/hooks/use-game-session"
import { SceneImage } from "@/components/scene-image"
import { ChatInput } from "@/components/chat-input"
import { HistorySheet } from "@/components/history-sheet"
import { Button } from "@/components/ui/button"

const LOADING_HINTS = [
  "Хэргийн газрыг шинж. Гэрчээс асуу. Цагийн дарааллыг угсар.",
  "Бэлэн болоод &ldquo;Би [нэр]-ийг буруутгаж байна&rdquo; гэж хэлээрэй.",
  "Нэг хүний хэлснийг нөгөөд нь тулгаж асуу.",
  "Гэрч бүр зөвхөн өөрийн харсан, сонссон зүйлээ мэднэ.",
  "Жижиг зөрүү том худлыг илчилж болно.",
  "Зөн совиндоо итгэ &mdash; гэхдээ цаг, баримт хоёрыг тулга.",
]

// Cost breakdown only renders when ?showCost is in the URL (dev/debug).
const SHOW_COST =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("showCost")

export function ChatScreen({ onQuit }: { onQuit: () => void }) {
  const { state, send, retry, reset, maxTurns } = useGameSession({ trackCost: SHOW_COST })
  const [historyOpen, setHistoryOpen] = useState(false)
  const autoStartedRef = useRef<string | null>(null)

  useEffect(() => {
    if (autoStartedRef.current === state.sessionId) return
    autoStartedRef.current = state.sessionId
    void send("start")
  }, [state.sessionId, send])

  const displayTurn = Math.min(state.turn || 1, maxTurns)
  const isLastTurn = state.turnsRemaining === 1 && !state.gameOver
  const isNarrativeLoading = state.narrativeStatus === "loading"

  return (
    <div className="flex h-full w-full flex-col bg-noir-bg text-noir-cream">
      <header className="flex items-center justify-between border-b border-noir-border bg-noir-surface/80 px-3 pb-3 pt-12 backdrop-blur-md md:pt-6">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setHistoryOpen(true)}
            disabled={state.history.length === 0}
            aria-label="Хэргийн тэмдэглэл"
            className="h-9 w-9 text-noir-cream/70 hover:bg-noir-amber/10 hover:text-noir-amber disabled:opacity-30"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <span className="font-serif text-sm tracking-wide text-noir-amber">
            Алхам {displayTurn} / {maxTurns}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onQuit}
          className="h-8 px-3 text-xs uppercase tracking-[0.2em] text-noir-cream/70 hover:bg-noir-danger/20 hover:text-noir-cream"
        >
          Гарах
        </Button>
      </header>

      <SceneImage url={state.imageUrl} isLoading={state.imageStatus === "loading"} />

      <div className="relative flex-1 overflow-y-auto px-5 py-5">
        {isLastTurn && !isNarrativeLoading && (
          <div className="mb-4 rounded-md border border-noir-amber/50 bg-noir-amber/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-noir-amber">
              Сүүлийн алхам
            </p>
            <p className="mt-1 font-serif text-sm leading-6 text-noir-cream/85">
              Энэ бол 15 дахь, эцсийн боломж. Нотлох баримтаа нэгтгээд
              хэн юу мэдэж, юуг буруу ойлгосныг холбож буруутныг нэрлээрэй.
            </p>
          </div>
        )}

        {isNarrativeLoading ? (
          <LoadingHints />
        ) : state.narrative ? (
          <p
            key={state.turn}
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
              Юу хийхээ хэлээрэй, мөрдөгчөө &mdash; хэргийн газрыг шинж, гэрчээс
              асуу, эсвэл нэг хүний мэдүүлгийг нөгөөд нь тулга.
            </p>
          </div>
        )}

        {state.error && !isNarrativeLoading && (
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

      {state.gameOver ? (
        <div className="border-t border-noir-border bg-noir-surface/80 px-4 py-3 backdrop-blur-md">
          <p className="font-serif text-xs uppercase tracking-[0.24em] text-noir-amber">
            {state.isSolved ? "Хэрэг тайлагдлаа" : "Хэрэг хөрсөн"}
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              onClick={reset}
              className="flex-1 bg-noir-amber text-noir-bg hover:bg-noir-amber-soft"
            >
              Шинэ хэрэг
            </Button>
            <Button
              variant="outline"
              onClick={onQuit}
              className="flex-1 border-noir-border bg-transparent text-noir-cream hover:bg-noir-surface hover:text-noir-cream"
            >
              Гарах
            </Button>
          </div>
        </div>
      ) : (
        <ChatInput disabled={isNarrativeLoading} onSubmit={send} />
      )}

      <HistorySheet
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={state.history}
        cost={
          SHOW_COST ? { usage: state.usage, costUsd: state.costUsd } : undefined
        }
      />
    </div>
  )
}

function LoadingHints() {
  const [hintIndex, setHintIndex] = useState(() =>
    Math.floor(Math.random() * LOADING_HINTS.length),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setHintIndex((i) => (i + 1) % LOADING_HINTS.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
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
  )
}
