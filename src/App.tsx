import { Link, useNavigate } from 'react-router-dom'
import { clearTokens, getAccessToken } from '@/features/auth/tokenStorage'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Button } from '@/components/ui/button'

function App() {
  const navigate = useNavigate()
  const { mutate: logout } = useLogout()
  const isLoggedIn = !!getAccessToken()

  const handleLogout = () => {
    const accessToken = getAccessToken()
    if (accessToken) {
      logout(accessToken)
    }
    clearTokens()
    navigate('/login')
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 pt-10">
        <Link to="/login" className="underline">
          로그인
        </Link>
        <Link to="/signup" className="underline">
          회원가입
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 pt-10">
      <p>로그인 상태입니다.</p>
      <Button onClick={handleLogout}>로그아웃</Button>
    </div>
  )
}

export default App
