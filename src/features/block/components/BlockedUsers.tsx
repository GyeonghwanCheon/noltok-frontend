import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useBlockedUsers } from '@/features/block/hooks/useBlockedUsers'
import { useUnblockUser } from '@/features/block/hooks/useUnblockUser'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'

export function BlockedUsers() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useBlockedUsers()
  const blocks = data?.pages.flatMap((page) => page.blocks) ?? []

  const [errors, setErrors] = useState<Record<number, string>>({})
  const { mutate: unblock, variables: unblockingId, isPending: isUnblocking } = useUnblockUser()

  const handleUnblock = (blockId: number) => {
    setErrors((prev) => ({ ...prev, [blockId]: '' }))
    unblock(blockId, {
      onError: (error) => {
        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? '해제에 실패했습니다.')
          : '해제에 실패했습니다.'
        setErrors((prev) => ({ ...prev, [blockId]: message }))
      },
    })
  }

  if (isLoading) {
    return <p className="pt-10 text-center">불러오는 중...</p>
  }

  if (blocks.length === 0) {
    return <p className="pt-10 text-center text-muted-foreground">차단한 유저가 없습니다.</p>
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
      <ul className="flex flex-col gap-4">
        {blocks.map((block) => (
          <li key={block.blockId} className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <UserAvatar
                nickname={block.nickname}
                profileImageUrl={block.profileImageUrl}
                className="size-9 text-sm"
              />
              <div className="flex flex-1 flex-col">
                <span className="text-sm text-foreground">{block.nickname}</span>
                <span className="text-xs text-muted-foreground">{block.blockedAt} 차단</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUnblock(block.blockId)}
                disabled={isUnblocking && unblockingId === block.blockId}
              >
                해제
              </Button>
            </div>
            {errors[block.blockId] && (
              <p className="text-xs text-destructive">{errors[block.blockId]}</p>
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
