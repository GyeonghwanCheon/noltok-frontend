import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useFriends } from '@/features/friend/hooks/useFriends'
import { useDeleteFriend } from '@/features/friend/hooks/useDeleteFriend'
import { FriendNav } from '@/features/friend/components/FriendNav'
import { FriendDeleteDialog } from '@/features/friend/components/FriendDeleteDialog'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'
import type { FriendDto } from '@/features/friend/types'

export function FriendList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useFriends()
  const friends = data?.pages.flatMap((page) => page.friends) ?? []

  const [targetFriend, setTargetFriend] = useState<FriendDto | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const { mutate: deleteFriend, isPending: isDeleting } = useDeleteFriend()

  const handleConfirmDelete = (friendId: number) => {
    setDeleteError('')
    deleteFriend(friendId, {
      onSuccess: () => setTargetFriend(null),
      onError: (error) => {
        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? '삭제에 실패했습니다.')
          : '삭제에 실패했습니다.'
        setDeleteError(message)
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

  if (friends.length === 0) {
    return (
      <div className="mx-auto w-full max-w-sm pt-10">
        <FriendNav />
        <p className="text-center text-muted-foreground">아직 친구가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
      <FriendNav />
      <ul className="flex flex-col gap-3">
        {friends.map((friend) => (
          <li key={friend.friendId} className="flex items-center gap-3">
            <UserAvatar
              nickname={friend.nickname}
              profileImageUrl={friend.profileImageUrl}
              className="size-9 text-sm"
            />
            <span className="flex-1 text-sm text-foreground">{friend.nickname}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDeleteError('')
                setTargetFriend(friend)
              }}
            >
              삭제
            </Button>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          더보기
        </Button>
      )}

      <FriendDeleteDialog
        friend={targetFriend}
        onOpenChange={(open) => !open && setTargetFriend(null)}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
