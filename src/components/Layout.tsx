import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div>
      <header className="p-4">
        <Link to="/" className="text-sm font-semibold">
          noltok
        </Link>
      </header>
      <Outlet />
    </div>
  )
}
