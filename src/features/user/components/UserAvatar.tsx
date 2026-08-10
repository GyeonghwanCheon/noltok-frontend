import { cn } from '@/lib/utils'

interface UserAvatarProps {
  nickname: string
  profileImageUrl: string | null
  className?: string
}

export function UserAvatar({ nickname, profileImageUrl, className }: UserAvatarProps) {
  if (profileImageUrl) {
    return (
      <img
        src={profileImageUrl}
        alt="프로필 이미지"
        className={cn('rounded-full object-cover', className)}
      />
    )
  }

  return (
    <div className={cn('flex items-center justify-center rounded-full bg-muted', className)}>
      {nickname.charAt(0)}
    </div>
  )
}
