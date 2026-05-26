import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { HistoryEntry } from "@/hooks/use-game-session"

export function HistorySheet({
  open,
  onOpenChange,
  history,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: HistoryEntry[]
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          inset-x-0 bottom-0 mx-auto flex h-[85svh] max-h-svh w-full flex-col
          gap-0 overflow-hidden rounded-t-3xl border border-noir-border
          bg-noir-bg p-0 text-noir-cream
          pb-[env(safe-area-inset-bottom)]
          md:w-97.5 md:max-w-97.5
        "
      >
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-noir-cream/20" />
        </div>

        <SheetHeader className="border-b border-noir-border px-4 pt-3 pb-4">
          <SheetTitle className="font-serif text-xl tracking-wide text-noir-amber">
            Хэргийн тэмдэглэл
          </SheetTitle>
          <SheetDescription className="text-sm text-noir-cream/60">
            Өнөөг хүртэлх асуулт, мөрдлөг.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {history.length === 0 ? (
            <p className="pt-10 text-center font-serif text-sm italic text-noir-cream/50">
              Тэмдэглэл хоосон байна.
            </p>
          ) : (
            <ol className="space-y-6">
              {history.map((entry) => (
                <li
                  key={entry.turn}
                  className="border-l-2 border-noir-amber/40 pl-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-noir-amber/80">
                    Асуулт {entry.turn}
                  </p>
                  <p className="mt-1 wrap-break-word text-sm font-medium text-noir-cream">
                    &ldquo;{entry.query}&rdquo;
                  </p>
                  {entry.imageUrl && (
                    <img
                      src={entry.imageUrl}
                      alt={`Асуулт ${entry.turn}`}
                      loading="lazy"
                      className="mt-3 aspect-video w-full rounded-md border border-noir-border object-cover"
                    />
                  )}
                  <p className="mt-3 wrap-break-word font-serif text-[14px] leading-[1.7] text-noir-cream/80">
                    {entry.narrative}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
