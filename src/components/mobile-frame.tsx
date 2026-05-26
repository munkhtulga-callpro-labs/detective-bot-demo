import type { ReactNode } from "react"

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh w-full bg-neutral-950 text-neutral-100 md:flex md:items-center md:justify-center md:p-8">
      <div
        className="
          relative mx-auto flex h-svh w-full flex-col overflow-hidden bg-black
          md:h-[844px] md:w-[390px] md:rounded-[44px] md:border md:border-neutral-800
          md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_0_8px_#0a0a0a]
        "
      >
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 hidden h-6 w-32 -translate-x-1/2 rounded-full bg-black md:block" />
        {children}
      </div>
    </div>
  )
}
