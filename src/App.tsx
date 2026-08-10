import { Link } from 'react-router-dom'
import { getAccessToken } from '@/features/auth/tokenStorage'
import { useMyInfo } from '@/features/user/hooks/useMyInfo'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'

const categories: { label: string; to: string }[] = [
  { label: '친구', to: '/friends' },
  { label: '유저 검색', to: '/users/search' },
]

function App() {
  const isLoggedIn = !!getAccessToken()
  const { data: me } = useMyInfo({ enabled: isLoggedIn })

  return (
    <div
      className="flex min-h-screen flex-col bg-background"
      style={{
        backgroundImage:
          'linear-gradient(rgba(196,181,253,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(196,181,253,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <div className="px-10 pt-7">
        <Link to="/" className="font-mono text-base font-bold text-foreground">
          noltok<span className="text-primary">_</span>
        </Link>
      </div>

      <div className="grid grid-cols-3 items-center px-10 py-4">
        <div />
        <div className="flex items-center justify-center gap-6">
          {isLoggedIn &&
            categories.map((category) => (
              <Link
                key={category.to}
                to={category.to}
                className="font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                {category.label}
              </Link>
            ))}
        </div>
        <div className="flex justify-end">
          {isLoggedIn ? (
            me && (
              <Link to="/me" className="flex items-center gap-2">
                <UserAvatar
                  nickname={me.nickname}
                  profileImageUrl={me.profileImageUrl}
                  className="size-7 text-xs"
                />
                <span className="font-mono text-xs text-foreground">{me.nickname}</span>
              </Link>
            )
          ) : (
            <Link
              to="/login"
              className="rounded-md border border-border px-4 py-2 font-mono text-xs text-foreground"
            >
              login
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="flex flex-1 items-center justify-center px-10 pb-24">
        <div className="max-w-lg">
          <div className="mb-5 font-mono text-xs tracking-wide text-primary">
            // a real-time conversation
          </div>
          <h1 className="mb-5 text-5xl leading-tight font-bold tracking-tight text-foreground">
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
          {!isLoggedIn && (
            <Button
              asChild
              className="rounded-lg px-7 py-6 font-mono text-sm font-bold shadow-[0_0_0_1px_rgba(196,181,253,0.4),0_0_32px_rgba(196,181,253,0.35)]"
            >
              <Link to="/signup">start chat</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
