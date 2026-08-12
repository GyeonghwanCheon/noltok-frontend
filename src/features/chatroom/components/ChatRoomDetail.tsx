import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { useChatSocket } from '@/features/chatroom/hooks/useChatSocket'
import { useChatMessages } from '@/features/chatmessage/hooks/useChatMessages'
import { useMyInfo } from '@/features/user/hooks/useMyInfo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ChatMessageListResponse, ChatMessageResponse } from '@/features/chatmessage/types'

const statusLabels = {
  connecting: '연결 중...',
  connected: '연결됨',
  error: '연결에 실패했습니다.',
}

export function ChatRoomDetail() {
  const { roomId: roomIdParam } = useParams<{ roomId: string }>()
  const roomId = Number(roomIdParam)
  const queryClient = useQueryClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: me } = useMyInfo()
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChatMessages(roomId)
  const messages = data ? [...data.pages].reverse().flatMap((page) => page.messages) : []

  const handleIncomingMessage = (message: ChatMessageResponse) => {
    queryClient.setQueryData<InfiniteData<ChatMessageListResponse>>(
      ['chatMessages', roomId],
      (old) => {
        if (!old) return old
        const alreadyExists = old.pages.some((page) =>
          page.messages.some((m) => m.messageId === message.messageId),
        )
        if (alreadyExists) return old
        const pages = [...old.pages]
        pages[0] = { ...pages[0], messages: [...pages[0].messages, message] }
        return { ...old, pages }
      },
    )
    bottomRef.current?.scrollIntoView()
  }

  const { status, errorMessage } = useChatSocket(roomId, handleIncomingMessage)

  useEffect(() => {
    // 최초 로딩 완료 시 한 번만 — "더보기"로 과거 페이지를 더 불러올 때는 스크롤을 안 건드림
    if (!isLoading) {
      bottomRef.current?.scrollIntoView()
    }
  }, [isLoading])

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 pt-10">
      <p className="text-center text-xs text-muted-foreground">{statusLabels[status]}</p>
      {status === 'error' && errorMessage && (
        <p className="text-center text-xs text-destructive">{errorMessage}</p>
      )}

      {isLoading && <p className="text-center text-sm">불러오는 중...</p>}

      {!isLoading && (
        <div className="flex flex-col gap-3">
          {hasNextPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              이전 메시지 더보기
            </Button>
          )}
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              아직 메시지가 없습니다.
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {messages.map((message) => {
              const isMine = message.senderId === me?.userId
              return (
                <li
                  key={message.messageId}
                  className={cn('flex flex-col', isMine ? 'items-end' : 'items-start')}
                >
                  {!isMine && (
                    <span className="text-xs text-muted-foreground">{message.senderNickname}</span>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-3 py-1.5 text-sm',
                      isMine
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground',
                    )}
                  >
                    {message.content}
                  </div>
                </li>
              )
            })}
          </ul>
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
