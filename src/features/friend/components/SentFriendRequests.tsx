import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useSentFriendRequests } from '@/features/friend/hooks/useSentFriendRequests'
import { useCancelFriendRequest } from '@/features/friend/hooks/useCancelFriendRequest'
import { FriendNav } from '@/features/friend/components/FriendNav'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'

export function SentFriendRequests() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSentFriendRequests()
  const requests = data?.pages.flatMap((page) => page.requests) ?? []

  const [errors, setErrors] = useState<Record<number, string>>({})
  const { mutate: cancel, variables: cancelingId, isPending: isCanceling } =
    useCancelFriendRequest()

  const handleCancel = (friendId: number) => {
    setErrors((prev) => ({ ...prev, [friendId]: '' }))
    cancel(friendId, {
      onError: (error) => {
        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? '요청 취소에 실패했습니다.')
          : '요청 취소에 실패했습니다.'
        setErrors((prev) => ({ ...prev, [friendId]: message }))
      },
    })
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
        <p className="text-center text-muted-foreground">보낸 친구 요청이 없습니다.</p>
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
                nickname={request.receiverNickname}
                profileImageUrl={request.receiverProfileImageUrl}
                className="size-9 text-sm"
              />
              <div className="flex flex-1 flex-col">
                <span className="text-sm text-foreground">{request.receiverNickname}</span>
                <span className="text-xs text-muted-foreground">{request.requestedAt} 요청</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCancel(request.friendId)}
                disabled={isCanceling && cancelingId === request.friendId}
              >
                취소
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
