import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { FriendDto } from '@/features/friend/types'

interface FriendDeleteDialogProps {
  friend: FriendDto | null
  onOpenChange: (open: boolean) => void
  isDeleting: boolean
  errorMessage?: string
  onConfirm: (friendId: number) => void
}

export function FriendDeleteDialog({
  friend,
  onOpenChange,
  isDeleting,
  errorMessage,
  onConfirm,
}: FriendDeleteDialogProps) {
  return (
    <Dialog open={!!friend} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-4 py-8">
        <DialogTitle className="text-center text-base font-bold">
          {friend?.nickname}님을 친구에서 삭제하시겠어요?
        </DialogTitle>
        <p className="text-center text-xs text-muted-foreground">
          삭제하면 즉시 서로의 친구 목록에서 사라집니다.
        </p>
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
            onClick={() => friend && onConfirm(friend.friendId)}
            disabled={isDeleting}
          >
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
