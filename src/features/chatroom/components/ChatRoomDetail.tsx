import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Search } from 'lucide-react'
import { useChatSocket } from '@/features/chatroom/hooks/useChatSocket'
import { useMarkAsRead } from '@/features/chatroom/hooks/useMarkAsRead'
import { useChatRoomDetail } from '@/features/chatroom/hooks/useChatRoomDetail'
import { useChatMessages } from '@/features/chatmessage/hooks/useChatMessages'
import { useDeleteMessage } from '@/features/chatmessage/hooks/useDeleteMessage'
import { useMyInfo } from '@/features/user/hooks/useMyInfo'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { MessageDeleteDialog } from '@/features/chatmessage/components/MessageDeleteDialog'
import { MessageSearchDialog } from '@/features/chatmessage/components/MessageSearchDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import type { ChatMessageListResponse, ChatMessageResponse } from '@/features/chatmessage/types'
import type { ChatRoomReadEventResponse } from '@/features/chatroom/types'

const statusLabels = {
  connecting: '연결 중...',
  connected: '연결됨',
  error: '연결에 실패했습니다.',
}

export function ChatRoomDetail() {
  const { roomId: roomIdParam } = useParams<{ roomId: string }>()
  const roomId = Number(roomIdParam)
  const queryClient = useQueryClient()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // scrollIntoView는 정렬 기준이 항상 명확하지 않아 최신 메시지가 살짝 잘려
  // 보일 수 있음 — 스크롤 컨테이너의 scrollTop을 직접 맨 아래로 맞춤
  const scrollToBottom = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  const { data: me } = useMyInfo()
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChatMessages(roomId)
  const messages = data ? [...data.pages].reverse().flatMap((page) => page.messages) : []

  // 멤버별 마지막으로 읽은 메시지 id — 초기값은 REST(입장 전 이미 읽힌 상태),
  // 이후 갱신은 소켓 이벤트로. REST만 쓰면 상대가 지금 읽어도 화면이 안 바뀌고,
  // 소켓만 쓰면 입장 전에 이미 일어난 읽음 상태를 알 방법이 없어서 둘 다 필요함
  const { data: roomDetail } = useChatRoomDetail(roomId)
  const [readStatus, setReadStatus] = useState<Map<number, number>>(new Map())

  useEffect(() => {
    if (roomDetail) {
      setReadStatus(new Map(roomDetail.members.map((m) => [m.userId, m.lastReadMessageId ?? 0])))
    }
  }, [roomDetail])

  const handleReadUpdate = (event: ChatRoomReadEventResponse) => {
    setReadStatus((prev) => new Map(prev).set(event.userId, event.lastReadMessageId))
  }

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
  }

  // 내가 삭제했을 때(mutation onSuccess)와 남이 삭제했을 때(소켓 이벤트) 둘 다
  // 여기로 모아서 처리 — 캐시에서 지우는 로직이 두 곳에 따로 있으면 나중에
  // 한쪽만 고치는 실수가 생기기 쉬움
  const removeMessageFromCache = (messageId: number) => {
    queryClient.setQueryData<InfiniteData<ChatMessageListResponse>>(
      ['chatMessages', roomId],
      (old) => {
        if (!old) return old
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.filter((m) => m.messageId !== messageId),
        }))
        return { ...old, pages }
      },
    )
  }

  const [content, setContent] = useState('')
  const [sendError, setSendError] = useState('')

  const { status, errorMessage, sendMessage } = useChatSocket(roomId, {
    onMessage: handleIncomingMessage,
    onSendError: setSendError,
    onReadUpdate: handleReadUpdate,
    onMessageDeleted: removeMessageFromCache,
  })

  // 삭제 대상 메시지 id — 우클릭 메뉴에서 "삭제" 선택 시 세팅, 확인 다이얼로그가 이 값으로 열림
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage()

  const handleConfirmDelete = () => {
    if (deleteTarget === null) return
    setDeleteError('')
    deleteMessage(
      { roomId, messageId: deleteTarget },
      {
        onSuccess: () => {
          removeMessageFromCache(deleteTarget)
          setDeleteTarget(null)
        },
        onError: (error) => {
          const message = isAxiosError<{ message?: string }>(error)
            ? (error.response?.data?.message ?? '삭제에 실패했습니다.')
            : '삭제에 실패했습니다.'
          setDeleteError(message)
        },
      },
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    setSendError('')
    sendMessage(trimmed)
    setContent('')
  }

  const [searchOpen, setSearchOpen] = useState(false)

  // 검색 결과 클릭 시 이미 로드된 메시지면 스크롤 이동, 아직 안 불러온
  // 과거 메시지면 아무 동작 없음 — 임의 시점으로 점프하려면 메시지 목록을
  // 그 지점 기준으로 새로 불러오는 별도 전략이 필요해서 이번 스코프 밖
  const handleSelectSearchResult = (messageId: number) => {
    document.getElementById(`message-${messageId}`)?.scrollIntoView({ block: 'center' })
  }

  // DOM 커밋 이후(useEffect)에 scrollHeight를 읽어야 방금 추가된 메시지까지 반영된 높이가 나옴.
  // 의존성이 최신 메시지 id라 "더보기"로 과거 메시지를 앞에 붙이는 경우(최신 메시지는 그대로)엔
  // 재실행되지 않아 스크롤 위치가 안 흔들림
  const lastMessageId = messages.at(-1)?.messageId
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom()
    }
  }, [isLoading, lastMessageId])

  // 이 화면에 들어와 있는 동안(최초 진입 + 새 메시지 도착마다)엔 "읽음" 처리 —
  // 채팅방 목록의 안읽음 숫자가 여기서 안 사라지던 버그의 원인이 이 호출 자체가 없었던 것
  const { mutate: markAsRead } = useMarkAsRead()
  useEffect(() => {
    if (!isLoading && lastMessageId !== undefined) {
      markAsRead(roomId)
    }
  }, [isLoading, lastMessageId, roomId, markAsRead])

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 pt-10">
      <div className="flex items-center justify-between">
        {/* size-7 스페이서 — 오른쪽 검색 버튼과 폭을 맞춰서 상태 텍스트가 실제로 가운데 오도록 */}
        <span className="size-7 shrink-0" />
        <p className="flex-1 text-center text-xs text-muted-foreground">{statusLabels[status]}</p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSearchOpen(true)}
          aria-label="메시지 검색"
        >
          <Search />
        </Button>
      </div>
      {status === 'error' && errorMessage && (
        <p className="text-center text-xs text-destructive">{errorMessage}</p>
      )}

      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-muted">
        {/* 이 영역만 리사이즈 가능 — 우측 하단을 드래그하면 높이가 바뀜, 입력창엔 영향 없음 */}
        <div
          ref={scrollContainerRef}
          className="h-[440px] max-h-[840px] min-h-[120px] resize-y overflow-y-auto bg-background p-3"
        >
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
                {messages.map((message, index) => {
                  const isMine = message.senderId === me?.userId
                  // 연속된 같은 발신자 메시지 묶음의 첫 번째에만 아바타/닉네임 표시 (카톡 방식)
                  const showSenderInfo =
                    !isMine &&
                    (index === 0 || messages[index - 1].senderId !== message.senderId)

                  // 말풍선 자체가 아니라 이 wrapper에 max-width를 걸어야 함 — wrapper는 li(정해진
                  // 폭)를 기준으로 크기가 정해지는데, 말풍선에 직접 max-w-[80%]를 걸면 아직 폭이
                  // 정해지지 않은 wrapper를 기준으로 계산돼서 순환 참조가 생기고, 텍스트 길이에
                  // 따라 폭이 제멋대로(짧은 텍스트일수록 더 좁게) 나오는 버그가 있었음
                  if (isMine) {
                    // 상대가 보낸 메시지엔 표시 안 함(내가 이미 본 거라 불필요) — 내가 보낸
                    // 메시지에만, 나를 제외한 멤버 중 아직 안 읽은 사람 수를 계산
                    const unreadCount = (roomDetail?.members ?? []).filter(
                      (member) =>
                        member.userId !== me?.userId &&
                        (readStatus.get(member.userId) ?? 0) < message.messageId,
                    ).length

                    return (
                      <li
                        key={message.messageId}
                        id={`message-${message.messageId}`}
                        className="flex min-w-0 items-end justify-end gap-1.5"
                      >
                        {unreadCount > 0 && (
                          <span className="shrink-0 text-xs text-muted-foreground">{unreadCount}</span>
                        )}
                        <ContextMenu>
                          <ContextMenuTrigger asChild>
                            <div className="max-w-[80%] rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">
                              {message.content}
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem
                              variant="destructive"
                              onSelect={() => setDeleteTarget(message.messageId)}
                            >
                              삭제
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      </li>
                    )
                  }

                  return (
                    <li
                      key={message.messageId}
                      id={`message-${message.messageId}`}
                      className="flex min-w-0 items-end gap-2"
                    >
                      {showSenderInfo ? (
                        <UserAvatar
                          nickname={message.senderNickname}
                          profileImageUrl={message.senderProfileImageUrl}
                          className="size-7 shrink-0 text-xs"
                        />
                      ) : (
                        <div className="size-7 shrink-0" />
                      )}
                      <div className="flex min-w-0 max-w-[80%] flex-col items-start">
                        {showSenderInfo && (
                          <span className="text-xs text-muted-foreground">
                            {message.senderNickname}
                          </span>
                        )}
                        <div className="rounded-lg bg-muted px-3 py-1.5 text-sm text-foreground">
                          {message.content}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* 리사이즈 영역 바깥의 고정 입력창 */}
        <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-border p-2">
          <Input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="메시지 입력"
            disabled={status !== 'connected'}
          />
          <Button type="submit" disabled={status !== 'connected'}>
            전송
          </Button>
        </form>
      </div>
      {sendError && <p className="text-xs text-destructive">{sendError}</p>}

      <MessageSearchDialog
        roomId={roomId}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectMessage={handleSelectSearchResult}
      />

      <MessageDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
            setDeleteError('')
          }
        }}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
