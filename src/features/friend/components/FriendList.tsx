import { useFriends } from '@/features/friend/hooks/useFriends'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'

export function FriendList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useFriends()
  const friends = data?.pages.flatMap((page) => page.friends) ?? []

  if (isLoading) {
    return <p className="pt-10 text-center">불러오는 중...</p>
  }

  if (friends.length === 0) {
    return <p className="pt-10 text-center text-muted-foreground">아직 친구가 없습니다.</p>
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
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
