import { Link, Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen bg-background">
      {!isHome && (
        <header className="p-4">
          <Link to="/" className="font-mono text-sm font-bold text-foreground">
            noltok<span className="text-primary">_</span>
          </Link>
        </header>
      )}
      <Outlet />
    </div>
  )
}
