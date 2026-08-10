import { useFriends } from '@/features/friend/hooks/useFriends'
import { FriendNav } from '@/features/friend/components/FriendNav'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'

export function FriendList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useFriends()
  const friends = data?.pages.flatMap((page) => page.friends) ?? []

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
            <div className="flex flex-col">
              <span className="text-sm text-foreground">{friend.nickname}</span>
              <span className="text-xs text-muted-foreground">
                {friend.becameFriendAt}부터 친구
              </span>
            </div>
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
