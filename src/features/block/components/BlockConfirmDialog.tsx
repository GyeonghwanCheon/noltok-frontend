import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface BlockConfirmDialogProps {
  targetNickname: string | null
  onOpenChange: (open: boolean) => void
  isBlocking: boolean
  errorMessage?: string
  onConfirm: (nickname: string) => void
}

export function BlockConfirmDialog({
  targetNickname,
  onOpenChange,
  isBlocking,
  errorMessage,
  onConfirm,
}: BlockConfirmDialogProps) {
  return (
    <Dialog open={!!targetNickname} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-4 py-8">
        <DialogTitle className="text-center text-base font-bold">
          {targetNickname}님을 차단하시겠어요?
        </DialogTitle>
        <p className="text-center text-xs text-muted-foreground">
          차단하면 즉시 친구 관계가 해제되며, 서로 친구 요청을 보낼 수 없습니다.
        </p>
        {errorMessage && (
          <p className="text-center text-xs text-destructive">{errorMessage}</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isBlocking}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => targetNickname && onConfirm(targetNickname)}
            disabled={isBlocking}
          >
            차단
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
