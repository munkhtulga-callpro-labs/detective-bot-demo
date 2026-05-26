import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RulesDialog } from "@/components/rules-dialog"

export function HomeScreen({ onStart }: { onStart: () => void }) {
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <div
      className="relative flex h-full w-full flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/home-screen-illustration.jpg)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/85" />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pb-10 pt-16 md:pt-20">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/70">
            Хиймэл оюунд суурилсан нууцлаг гэмт хэрэг
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-wide text-amber-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            МӨРЧ
          </h1>
          <div className="mx-auto mt-3 h-px w-16 bg-amber-200/40" />
        </div>

        <div className="mt-auto flex w-full flex-col gap-3">
          <Button
            size="lg"
            onClick={onStart}
            className="h-12 w-full rounded-full bg-amber-200 text-base font-semibold tracking-wide text-neutral-900 shadow-lg shadow-black/40 hover:bg-amber-100"
          >
            Эхлэх
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setRulesOpen(true)}
            className="h-12 w-full rounded-full border-amber-200/40 bg-white/5 text-base font-medium tracking-wide text-amber-50 backdrop-blur-sm hover:bg-white/10 hover:text-amber-50"
          >
            Тоглоомын дүрэм
          </Button>
        </div>
      </div>

      <RulesDialog open={rulesOpen} onOpenChange={setRulesOpen} />
    </div>
  )
}
