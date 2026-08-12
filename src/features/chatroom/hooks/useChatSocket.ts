import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAccessToken } from '@/features/auth/tokenStorage'
import type { ChatMessageResponse } from '@/features/chatmessage/types'
import type { ChatRoomReadEventResponse } from '@/features/chatroom/types'

type ConnectionStatus = 'connecting' | 'connected' | 'error'

interface UseChatSocketOptions {
  onMessage?: (message: ChatMessageResponse) => void
  onSendError?: (message: string) => void
  onReadUpdate?: (event: ChatRoomReadEventResponse) => void
}

export function useChatSocket(roomId: number, options?: UseChatSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [errorMessage, setErrorMessage] = useState<string>()
  const clientRef = useRef<Client | null>(null)

  // 콜백은 매 렌더 새 함수일 수 있어 ref로 최신값만 참조 (연결을 재생성하지 않기 위함)
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    setStatus('connecting')
    setErrorMessage(undefined)

    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${getAccessToken()}` },
      reconnectDelay: 0,
      onConnect: () => {
        client.subscribe(`/user/queue/rooms/${roomId}`, (frame) => {
          optionsRef.current?.onMessage?.(JSON.parse(frame.body) as ChatMessageResponse)
        })
        client.subscribe('/user/queue/errors', (frame) => {
          optionsRef.current?.onSendError?.(frame.body)
        })
        client.subscribe(`/user/queue/rooms/${roomId}/reads`, (frame) => {
          optionsRef.current?.onReadUpdate?.(JSON.parse(frame.body) as ChatRoomReadEventResponse)
        })
        setStatus('connected')
      },
      onStompError: (frame) => {
        setStatus('error')
        setErrorMessage(frame.headers.message ?? '연결에 실패했습니다.')
      },
      onWebSocketClose: () => {
        setStatus((prev) => (prev === 'connected' ? 'error' : prev))
      },
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate()
      clientRef.current = null
    }
  }, [roomId])

  const sendMessage = useCallback(
    (content: string) => {
      clientRef.current?.publish({
        destination: `/app/rooms/${roomId}/messages`,
        body: JSON.stringify({ type: 'TEXT', content }),
      })
    },
    [roomId],
  )

  return { status, errorMessage, sendMessage }
}
