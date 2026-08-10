import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const tabs = [
  { label: '친구 목록', to: '/friends' },
  { label: '받은 요청', to: '/friends/received' },
]

export function FriendNav() {
  return (
    <nav className="mx-auto flex w-full max-w-sm gap-4 pb-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            cn(
              'font-mono text-xs',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
