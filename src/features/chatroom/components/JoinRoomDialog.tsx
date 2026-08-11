import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { SearchRoomDto } from '@/features/chatroom/types'

interface JoinRoomDialogProps {
  room: SearchRoomDto | null
  onOpenChange: (open: boolean) => void
  isJoining: boolean
  errorMessage?: string
  onConfirm: (roomId: number, password: string) => void
}

export function JoinRoomDialog({
  room,
  onOpenChange,
  isJoining,
  errorMessage,
  onConfirm,
}: JoinRoomDialogProps) {
  const [password, setPassword] = useState('')

  return (
    <Dialog
      open={!!room}
      onOpenChange={(open) => {
        if (!open) setPassword('')
        onOpenChange(open)
      }}
    >
      <DialogContent className="flex flex-col gap-4 py-8">
        <DialogTitle className="text-center text-base font-bold">
          {room?.roomname} 입장
        </DialogTitle>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {errorMessage && (
          <p className="text-center text-xs text-destructive">{errorMessage}</p>
        )}
        <Button
          disabled={isJoining || !password}
          onClick={() => room && onConfirm(room.roomId, password)}
        >
          입장
        </Button>
      </DialogContent>
    </Dialog>
  )
}
