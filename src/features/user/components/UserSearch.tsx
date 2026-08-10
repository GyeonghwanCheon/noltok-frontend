import { useState, type FormEvent } from 'react'
import { useSearchUsers } from '@/features/user/hooks/useSearchUsers'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function UserSearch() {
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState('')
  const { data, isLoading } = useSearchUsers(submitted)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(keyword)
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
          {data.map((user) => (
            <li key={user.userId} className="flex items-center gap-3">
              <UserAvatar
                nickname={user.nickname}
                profileImageUrl={user.profileImageUrl}
                className="size-9 text-sm"
              />
              <span className="text-sm text-foreground">{user.nickname}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
