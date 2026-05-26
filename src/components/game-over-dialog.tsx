import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function GameOverDialog({
  open,
  isSolved,
  imageUrl,
  onNewCase,
  onClose,
}: {
  open: boolean
  isSolved: boolean
  imageUrl: string | null
  onNewCase: () => void
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-noir-border bg-noir-bg text-noir-cream sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-wide text-noir-amber">
            {isSolved ? "Хэрэг тайлагдлаа!" : "Хэрэг хөрсөн"}
          </DialogTitle>
          <DialogDescription className="text-noir-cream/70">
            {isSolved
              ? "Сайн ажиллалаа, мөрдөгч. Өнөө шөнө шударга ёс ялалаа."
              : "Мөр хөрчээ. Алуурчин шөнийн харанхуйд алга болов."}
          </DialogDescription>
        </DialogHeader>
        {imageUrl && (
          <div className="overflow-hidden rounded-md border border-noir-border">
            <img
              src={imageUrl}
              alt="Final scene"
              className="h-48 w-full object-cover"
            />
          </div>
        )}
        <div className="mt-2 flex gap-2">
          <Button
            onClick={onNewCase}
            className="flex-1 bg-noir-amber text-noir-bg hover:bg-noir-amber-soft"
          >
            Шинэ хэрэг
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-noir-border bg-transparent text-noir-cream hover:bg-noir-surface hover:text-noir-cream"
          >
            Хаах
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
