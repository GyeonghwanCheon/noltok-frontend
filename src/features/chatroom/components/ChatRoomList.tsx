import { Link } from 'react-router-dom'
import { useChatRooms } from '@/features/chatroom/hooks/useChatRooms'
import { Button } from '@/components/ui/button'
import type { ChatRoomType } from '@/features/chatroom/types'

const typeLabels: Record<ChatRoomType, string> = {
  DIRECT: '1:1',
  GROUP: '그룹',
  OPEN: '공개',
  OPEN_PRIVATE: '비밀번호 방',
}

export function ChatRoomList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useChatRooms()
  const rooms = data?.pages.flatMap((page) => page.rooms) ?? []

  const newRoomButton = (
    <Button asChild size="sm" className="self-end">
      <Link to="/rooms/new">새 채팅방</Link>
    </Button>
  )

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
        {newRoomButton}
        <p className="text-center">불러오는 중...</p>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
        {newRoomButton}
        <p className="text-center text-muted-foreground">참여한 채팅방이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
      {newRoomButton}
      <ul className="flex flex-col gap-3">
        {rooms.map((room) => (
          <li
            key={room.roomId}
            className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
          >
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {room.roomname ?? '1:1 대화'}
                </span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {typeLabels[room.type]}
                </span>
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {room.lastMessage ?? '메시지가 없습니다'}
              </span>
            </div>
            {room.unreadCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {room.unreadCount}
              </span>
            )}
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          더보기
        </Button>
      )}
    </div>
  )
}
