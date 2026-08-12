import { useParams } from 'react-router-dom'
import { useChatSocket } from '@/features/chatroom/hooks/useChatSocket'

const statusLabels = {
  connecting: '연결 중...',
  connected: '연결됨',
  error: '연결에 실패했습니다.',
}

export function ChatRoomDetail() {
  const { roomId } = useParams<{ roomId: string }>()
  const { status, errorMessage } = useChatSocket(Number(roomId))

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 pt-10">
      <p className="text-sm text-muted-foreground">{statusLabels[status]}</p>
      {status === 'error' && errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
