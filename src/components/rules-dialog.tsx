import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function RulesDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-noir-border bg-noir-bg text-noir-cream sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-wide text-noir-amber">
            Тоглох заавар
          </DialogTitle>
          <DialogDescription className="text-noir-cream/70">
            15 алхамд багтааж мэдүүлэг, цаг, баримтыг холбоорой.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-noir-cream/90">
          <p>
            Танд хэргийг тайлахын тулд{" "}
            <span className="font-semibold text-noir-amber">15 мөрдлөгийн алхам</span>{" "}
            бий. Алхам бүрт юу хийхээ бичээрэй:
          </p>
          <ul className="space-y-1 pl-4 font-serif italic text-noir-cream/70">
            <li>&ldquo;Цогцсыг шинжлэх&rdquo;</li>
            <li>&ldquo;Гэрчээс улаан гэрлийн талаар асуух&rdquo;</li>
            <li>&ldquo;Ширээний хайрцгийг шалгах&rdquo;</li>
            <li>&ldquo;Нэг гэрчийн хэлснийг нөгөөд нь тулгаж асуух&rdquo;</li>
          </ul>
          <p>
            Сэжигтэн бүр бүх үнэнийг мэдэхгүй. Тэд зөвхөн өөрийн харсан,
            сонссон, нуусан зүйлээ хэлнэ. Нэг хүний мэдүүлгийг нөгөөд нь
            тулгахад цагийн зөрүү, буруу ойлголт илэрч болно.
          </p>
          <p>Алуурчныг нэрлэхэд бэлэн болсон үедээ ингэж бичээрэй:</p>
          <ul className="pl-4 font-serif italic text-noir-cream/70">
            <li>&ldquo;Би [нэр]-ийг буруутгаж байна&rdquo;</li>
          </ul>
          <p className="pt-2 font-serif italic text-noir-amber">
            Амжилт хүсье, мөрдөгчөө.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
