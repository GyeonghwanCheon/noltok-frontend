import { useState, type FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchMessages } from '@/features/chatmessage/hooks/useSearchMessages'
import type { ChatMessageResponse } from '@/features/chatmessage/types'

interface MessageSearchDialogProps {
  roomId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectMessage: (messageId: number) => void
}

// "2026-08-12T21:44:26.596621" → "2026-08-12 21:44:26" — Date로 파싱하면
// 타임존 재해석 위험이 있어서, 문자열 그대로 T와 마이크로초 부분만 잘라냄
function formatDateTime(isoDateTime: string) {
  const [date, time] = isoDateTime.split('T')
  return `${date} ${time.split('.')[0]}`
}

// 검색어가 내용 안에 여러 번 나와도 첫 번째만 강조 — 카톡도 검색 결과 목록에선
// 첫 매치 위치만 보여주면 충분하고, 전부 강조하면 오히려 산만해짐
function highlightFirstMatch(content: string, keyword: string) {
  const index = content.toLowerCase().indexOf(keyword.toLowerCase())
  if (index === -1) return content

  return (
    <>
      {content.slice(0, index)}
      <mark className="rounded-sm bg-primary/30 text-foreground">
        {content.slice(index, index + keyword.length)}
      </mark>
      {content.slice(index + keyword.length)}
    </>
  )
}

export function MessageSearchDialog({ roomId, open, onOpenChange, onSelectMessage }: MessageSearchDialogProps) {
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState('')
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useSearchMessages(
    roomId,
    submitted,
  )
  const messages = data?.pages.flatMap((page) => page.messages) ?? []

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(keyword)
  }

  const handleSelect = (message: ChatMessageResponse) => {
    onSelectMessage(message.messageId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[70vh] flex-col gap-4">
        <DialogTitle className="text-base font-bold">메시지 검색</DialogTitle>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="검색할 내용 입력"
            autoFocus
          />
          <Button type="submit">검색</Button>
        </form>

        {submitted.length > 0 && isLoading && (
          <p className="text-sm text-muted-foreground">검색 중...</p>
        )}

        {submitted.length > 0 && !isLoading && messages.length === 0 && (
          <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
        )}

        {messages.length > 0 && (
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {messages.map((message) => (
              <li key={message.messageId}>
                <button
                  type="button"
                  onClick={() => handleSelect(message)}
                  className="flex w-full flex-col gap-1 rounded-lg border border-border px-3 py-2 text-left hover:bg-muted"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-foreground">{message.senderNickname}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDateTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{highlightFirstMatch(message.content, submitted)}</p>
                </button>
              </li>
            ))}
            {hasNextPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                더보기
              </Button>
            )}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
