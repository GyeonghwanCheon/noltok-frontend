import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ChatRoomSummaryDto } from '@/features/chatroom/types'

interface LeaveRoomDialogProps {
  room: ChatRoomSummaryDto | null
  onOpenChange: (open: boolean) => void
  isLeaving: boolean
  errorMessage?: string
  onConfirm: (roomId: number) => void
}

export function LeaveRoomDialog({
  room,
  onOpenChange,
  isLeaving,
  errorMessage,
  onConfirm,
}: LeaveRoomDialogProps) {
  return (
    <Dialog open={!!room} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-4 py-8">
        <DialogTitle className="text-center text-base font-bold">
          {room?.roomname ?? '1:1 대화'}에서 나가시겠어요?
        </DialogTitle>
        {errorMessage && (
          <p className="text-center text-xs text-destructive">{errorMessage}</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isLeaving}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => room && onConfirm(room.roomId)}
            disabled={isLeaving}
          >
            나가기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
