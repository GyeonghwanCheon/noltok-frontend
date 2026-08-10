import { Link, useNavigate } from 'react-router-dom'
import { useMyInfo } from '@/features/user/hooks/useMyInfo'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { clearTokens, getAccessToken } from '@/features/auth/tokenStorage'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Button } from '@/components/ui/button'

export function MyInfo() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useMyInfo()
  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    const accessToken = getAccessToken()
    if (accessToken) {
      logout(accessToken)
    }
    clearTokens()
    navigate('/')
  }

  if (isLoading) {
    return <p className="pt-10 text-center">불러오는 중...</p>
  }

  if (isError || !data) {
    return <p className="pt-10 text-center text-destructive">내 정보를 불러오지 못했습니다.</p>
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 pt-10">
      <UserAvatar
        nickname={data.nickname}
        profileImageUrl={data.profileImageUrl}
        className="size-20 text-2xl"
      />
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-medium">{data.nickname}</p>
        <p className="text-sm text-muted-foreground">{data.email}</p>
        <p className="text-sm text-muted-foreground">가입일: {data.createdAt}</p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/me/edit">수정</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/me/password">비밀번호 변경</Link>
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          로그아웃
        </Button>
        <Button asChild variant="outline">
          <Link to="/me/delete">회원 탈퇴</Link>
        </Button>
      </div>
    </div>
  )
}
