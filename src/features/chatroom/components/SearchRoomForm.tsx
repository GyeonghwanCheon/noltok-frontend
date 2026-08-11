import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSearchRooms } from '@/features/chatroom/hooks/useSearchRooms'
import { useJoinRoom } from '@/features/chatroom/hooks/useJoinRoom'
import { JoinRoomDialog } from '@/features/chatroom/components/JoinRoomDialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { SearchRoomDto } from '@/features/chatroom/types'

export function SearchRoomForm() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState('')
  const { data, isLoading } = useSearchRooms(submitted)
  const rooms = data?.pages.flatMap((page) => page.rooms) ?? []

  const [joinTarget, setJoinTarget] = useState<SearchRoomDto | null>(null)
  const [errors, setErrors] = useState<Record<number, string>>({})
  const { mutate: joinRoom, isPending: isJoining } = useJoinRoom()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(keyword)
  }

  const handleError = (roomId: number, error: unknown) => {
    const message = isAxiosError<{ message?: string }>(error)
      ? (error.response?.data?.message ?? '입장에 실패했습니다.')
      : '입장에 실패했습니다.'
    setErrors((prev) => ({ ...prev, [roomId]: message }))
  }

  const handleJoin = (roomId: number, password?: string) => {
    setErrors((prev) => ({ ...prev, [roomId]: '' }))
    joinRoom(
      { roomId, password },
      {
        onSuccess: () => navigate('/rooms'),
        onError: (error) => handleError(roomId, error),
      },
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="채팅방 이름으로 검색"
        />
        <Button type="submit">검색</Button>
      </form>

      {submitted && isLoading && (
        <p className="text-sm text-muted-foreground">검색 중...</p>
      )}

      {submitted && !isLoading && rooms.length === 0 && (
        <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
      )}

      {rooms.length > 0 && (
        <ul className="flex flex-col gap-3">
          {rooms.map((room) => (
            <li
              key={room.roomId}
              className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{room.roomname}</span>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {room.type === 'OPEN_PRIVATE' ? '비밀번호 방' : '공개'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{room.memberCount}명 참여 중</span>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    room.type === 'OPEN_PRIVATE' ? setJoinTarget(room) : handleJoin(room.roomId)
                  }
                  disabled={isJoining}
                >
                  입장
                </Button>
              </div>
              {errors[room.roomId] && (
                <p className="text-xs text-destructive">{errors[room.roomId]}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <JoinRoomDialog
        room={joinTarget}
        onOpenChange={(open) => !open && setJoinTarget(null)}
        isJoining={isJoining}
        errorMessage={joinTarget ? errors[joinTarget.roomId] : undefined}
        onConfirm={(roomId, password) => handleJoin(roomId, password)}
      />
    </div>
  )
}
