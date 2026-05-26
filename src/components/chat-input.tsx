import { useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ChatInput({
  disabled,
  onSubmit,
}: {
  disabled: boolean
  onSubmit: (query: string) => void
}) {
  const [value, setValue] = useState("")

  const handle = (e: FormEvent) => {
    e.preventDefault()
    if (disabled || !value.trim()) return
    onSubmit(value)
    setValue("")
  }

  return (
    <form
      onSubmit={handle}
      className="flex items-center gap-2 border-t border-noir-border bg-noir-surface/80 px-3 py-3 backdrop-blur-md"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Одоо юу хийх вэ, мөрдөгчөө?"
        className="h-11 flex-1 rounded-full border-noir-border bg-noir-bg/80 px-4 text-sm text-noir-cream placeholder:text-noir-cream/40 focus-visible:border-noir-amber focus-visible:ring-noir-amber/30"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        className="h-11 w-11 shrink-0 rounded-full bg-noir-amber text-noir-bg shadow-[0_0_20px_-4px_var(--color-noir-amber)] hover:bg-noir-amber-soft disabled:opacity-40 disabled:shadow-none"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
