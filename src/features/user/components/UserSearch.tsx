import { useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { useSearchUsers } from '@/features/user/hooks/useSearchUsers'
import { useSendFriendRequest } from '@/features/friend/hooks/useSendFriendRequest'
import { FriendInfoModal } from '@/features/friend/components/FriendInfoModal'
import { useBlockUser } from '@/features/block/hooks/useBlockUser'
import { BlockConfirmDialog } from '@/features/block/components/BlockConfirmDialog'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { UserSummaryResponse } from '@/features/user/types'

export function UserSearch() {
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState('')
  const { data, isLoading } = useSearchUsers(submitted)

  const [sentNicknames, setSentNicknames] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { mutate: sendRequest, variables: sendingNickname, isPending: isSending } =
    useSendFriendRequest()

  const [blockedNicknames, setBlockedNicknames] = useState<Set<string>>(new Set())
  const [blockErrors, setBlockErrors] = useState<Record<string, string>>({})
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser()

  const [selectedUser, setSelectedUser] = useState<UserSummaryResponse | null>(null)
  const [blockTarget, setBlockTarget] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(keyword)
  }

  const handleSendRequest = (nickname: string) => {
    setErrors((prev) => ({ ...prev, [nickname]: '' }))
    sendRequest(nickname, {
      onSuccess: () => {
        setSentNicknames((prev) => new Set(prev).add(nickname))
      },
      onError: (error) => {
        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? '요청 전송에 실패했습니다.')
          : '요청 전송에 실패했습니다.'
        setErrors((prev) => ({ ...prev, [nickname]: message }))
      },
    })
  }

  const handleOpenBlockConfirm = (nickname: string) => {
    setBlockErrors((prev) => ({ ...prev, [nickname]: '' }))
    setSelectedUser(null)
    setBlockTarget(nickname)
  }

  const handleConfirmBlock = (nickname: string) => {
    blockUser(nickname, {
      onSuccess: () => {
        setBlockedNicknames((prev) => new Set(prev).add(nickname))
        setBlockTarget(null)
      },
      onError: (error) => {
        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? '차단에 실패했습니다.')
          : '차단에 실패했습니다.'
        setBlockErrors((prev) => ({ ...prev, [nickname]: message }))
      },
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="닉네임으로 검색"
        />
        <Button type="submit">검색</Button>
      </form>

      {submitted && isLoading && (
        <p className="text-sm text-muted-foreground">검색 중...</p>
      )}

      {submitted && !isLoading && data?.length === 0 && (
        <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
      )}

      {data && data.length > 0 && (
        <ul className="flex flex-col gap-3">
          {data.map((user) => {
            const alreadySent = sentNicknames.has(user.nickname)
            const alreadyBlocked = blockedNicknames.has(user.nickname)
            return (
              <li key={user.userId} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedUser(user)}>
                    <UserAvatar
                      nickname={user.nickname}
                      profileImageUrl={user.profileImageUrl}
                      className="size-9 text-sm"
                    />
                  </button>
                  <button
                    className="flex-1 text-left text-sm text-foreground"
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.nickname}
                  </button>
                  <Button
                    size="sm"
                    variant={alreadySent ? 'outline' : 'default'}
                    disabled={alreadySent || (isSending && sendingNickname === user.nickname)}
                    onClick={() => handleSendRequest(user.nickname)}
                  >
                    {alreadySent ? '요청 보냄' : '요청'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={alreadyBlocked}
                    onClick={() => handleOpenBlockConfirm(user.nickname)}
                  >
                    {alreadyBlocked ? '차단됨' : '차단'}
                  </Button>
                </div>
                {errors[user.nickname] && (
                  <p className="text-xs text-destructive">{errors[user.nickname]}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <FriendInfoModal
        user={selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        alreadySent={!!selectedUser && sentNicknames.has(selectedUser.nickname)}
        isSending={isSending && !!selectedUser && sendingNickname === selectedUser.nickname}
        errorMessage={selectedUser ? errors[selectedUser.nickname] : undefined}
        onSendRequest={handleSendRequest}
        alreadyBlocked={!!selectedUser && blockedNicknames.has(selectedUser.nickname)}
        isBlocking={false}
        onBlock={handleOpenBlockConfirm}
      />

      <BlockConfirmDialog
        targetNickname={blockTarget}
        onOpenChange={(open) => !open && setBlockTarget(null)}
        isBlocking={isBlocking}
        errorMessage={blockTarget ? blockErrors[blockTarget] : undefined}
        onConfirm={handleConfirmBlock}
      />
    </div>
  )
}
