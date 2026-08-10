import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useReceivedFriendRequests } from '@/features/friend/hooks/useReceivedFriendRequests'
import { useAcceptFriendRequest } from '@/features/friend/hooks/useAcceptFriendRequest'
import { useRejectFriendRequest } from '@/features/friend/hooks/useRejectFriendRequest'
import { FriendNav } from '@/features/friend/components/FriendNav'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'

export function ReceivedFriendRequests() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useReceivedFriendRequests()
  const requests = data?.pages.flatMap((page) => page.requests) ?? []

  const [errors, setErrors] = useState<Record<number, string>>({})
  const { mutate: accept, variables: acceptingId, isPending: isAccepting } = useAcceptFriendRequest()
  const { mutate: reject, variables: rejectingId, isPending: isRejecting } = useRejectFriendRequest()

  const handleError = (friendId: number, error: unknown) => {
    const message = isAxiosError<{ message?: string }>(error)
      ? (error.response?.data?.message ?? '요청 처리에 실패했습니다.')
      : '요청 처리에 실패했습니다.'
    setErrors((prev) => ({ ...prev, [friendId]: message }))
  }

  const handleAccept = (friendId: number) => {
    setErrors((prev) => ({ ...prev, [friendId]: '' }))
    accept(friendId, { onError: (error) => handleError(friendId, error) })
  }

  const handleReject = (friendId: number) => {
    setErrors((prev) => ({ ...prev, [friendId]: '' }))
    reject(friendId, { onError: (error) => handleError(friendId, error) })
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-sm pt-10">
        <FriendNav />
        <p className="text-center">불러오는 중...</p>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="mx-auto w-full max-w-sm pt-10">
        <FriendNav />
        <p className="text-center text-muted-foreground">받은 친구 요청이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
      <FriendNav />
      <ul className="flex flex-col gap-4">
        {requests.map((request) => (
          <li key={request.friendId} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <UserAvatar
                nickname={request.requesterNickname}
                profileImageUrl={request.requesterProfileImageUrl}
                className="size-9 text-sm"
              />
              <div className="flex flex-1 flex-col">
                <span className="text-sm text-foreground">{request.requesterNickname}</span>
                <span className="text-xs text-muted-foreground">{request.requestedAt} 요청</span>
              </div>
              <Button
                size="sm"
                onClick={() => handleAccept(request.friendId)}
                disabled={
                  (isAccepting && acceptingId === request.friendId) ||
                  (isRejecting && rejectingId === request.friendId)
                }
              >
                수락
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(request.friendId)}
                disabled={
                  (isAccepting && acceptingId === request.friendId) ||
                  (isRejecting && rejectingId === request.friendId)
                }
              >
                거절
              </Button>
            </div>
            {errors[request.friendId] && (
              <p className="text-xs text-destructive">{errors[request.friendId]}</p>
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
