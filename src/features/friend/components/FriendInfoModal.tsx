import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { Button } from '@/components/ui/button'
import type { UserSummaryResponse } from '@/features/user/types'

interface FriendInfoModalProps {
  user: UserSummaryResponse | null
  onOpenChange: (open: boolean) => void
  alreadySent: boolean
  isSending: boolean
  errorMessage?: string
  onSendRequest: (nickname: string) => void
  alreadyBlocked: boolean
  isBlocking: boolean
  blockErrorMessage?: string
  onBlock: (nickname: string) => void
}

export function FriendInfoModal({
  user,
  onOpenChange,
  alreadySent,
  isSending,
  errorMessage,
  onSendRequest,
  alreadyBlocked,
  isBlocking,
  blockErrorMessage,
  onBlock,
}: FriendInfoModalProps) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center gap-4 py-8">
        <DialogTitle className="sr-only">
          {user?.nickname} 정보
        </DialogTitle>
        {user && (
          <>
            <UserAvatar
              nickname={user.nickname}
              profileImageUrl={user.profileImageUrl}
              className="size-19 text-2xl"
            />
            <span className="text-base font-bold text-foreground">{user.nickname}</span>
            <p className="w-full rounded-lg border border-dashed border-border py-2.5 text-center text-xs leading-relaxed text-muted-foreground">
              한줄 소개 <span className="text-primary">(추후 지원 예정)</span>
            </p>
            <div className="flex w-full gap-2">
              <Button
                className="flex-1"
                disabled={alreadySent || isSending}
                onClick={() => onSendRequest(user.nickname)}
              >
                {alreadySent ? '요청 보냄' : '요청 보내기'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={alreadyBlocked || isBlocking}
                onClick={() => onBlock(user.nickname)}
              >
                {alreadyBlocked ? '차단됨' : '차단'}
              </Button>
            </div>
            {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
            {blockErrorMessage && <p className="text-xs text-destructive">{blockErrorMessage}</p>}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
