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
    navigate('/')
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage:
          'linear-gradient(rgba(196,181,253,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(196,181,253,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <div className="mx-auto max-w-3xl px-10 pt-14 pb-24">
        <nav className="mb-24 flex items-center justify-between">
          <Link to="/" className="font-mono text-base font-bold text-foreground">
            noltok<span className="text-primary">_</span>
          </Link>
          {!isLoggedIn && (
            <Link
              to="/login"
              className="rounded-md border border-border px-4 py-2 font-mono text-xs text-foreground"
            >
              login
            </Link>
          )}
        </nav>

        {isLoggedIn ? (
          <div>
            <div className="mb-4 font-mono text-xs tracking-wide text-primary">// signed in</div>
            <h1 className="mb-6 max-w-lg text-3xl leading-tight font-bold text-foreground">
              로그인 상태입니다.
            </h1>
            <div className="flex gap-3">
              <Link
                to="/me"
                className="rounded-lg border border-border px-6 py-3 font-mono text-sm text-foreground"
              >
                내 정보 보기
              </Link>
              <Button
                onClick={handleLogout}
                className="rounded-lg font-mono text-sm font-bold shadow-[0_0_0_1px_rgba(196,181,253,0.4),0_0_32px_rgba(196,181,253,0.35)]"
              >
                로그아웃
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 font-mono text-xs tracking-wide text-primary">
              // a real-time conversation
            </div>
            <h1 className="mb-5 max-w-lg text-5xl leading-tight font-bold tracking-tight text-foreground">
              사람과 사람 사이,
              <br />
              <span className="text-primary [text-shadow:0_0_24px_rgba(196,181,253,0.5)]">
                가장 가벼운 연결
              </span>
            </h1>
            <p className="mb-8 max-w-md font-mono text-sm leading-7 text-muted-foreground">
              놀톡은 실시간으로 이어지는 작은 대화 공간입니다.
              <br />
              친구를 만들고, 이야기를 나누세요.
            </p>
            <Button
              asChild
              className="rounded-lg px-7 py-6 font-mono text-sm font-bold shadow-[0_0_0_1px_rgba(196,181,253,0.4),0_0_32px_rgba(196,181,253,0.35)]"
            >
              <Link to="/signup">start chat</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
