import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface MessageDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isDeleting: boolean
  errorMessage?: string
  onConfirm: () => void
}

export function MessageDeleteDialog({
  open,
  onOpenChange,
  isDeleting,
  errorMessage,
  onConfirm,
}: MessageDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-4 py-8">
        <DialogTitle className="text-center text-base font-bold">
          이 메시지를 삭제하시겠어요?
        </DialogTitle>
        {errorMessage && (
          <p className="text-center text-xs text-destructive">{errorMessage}</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
