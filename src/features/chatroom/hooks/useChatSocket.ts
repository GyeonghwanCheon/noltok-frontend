import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAccessToken } from '@/features/auth/tokenStorage'
import type { ChatMessageResponse } from '@/features/chatmessage/types'

type ConnectionStatus = 'connecting' | 'connected' | 'error'

export function useChatSocket(roomId: number, onMessage?: (message: ChatMessageResponse) => void) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [errorMessage, setErrorMessage] = useState<string>()

  // onMessage는 매 렌더 새 함수일 수 있어 ref로 최신값만 참조 (연결을 재생성하지 않기 위함)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    setStatus('connecting')
    setErrorMessage(undefined)

    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${getAccessToken()}` },
      reconnectDelay: 0,
      onConnect: () => {
        client.subscribe(`/user/queue/rooms/${roomId}`, (frame) => {
          onMessageRef.current?.(JSON.parse(frame.body) as ChatMessageResponse)
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

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [roomId])

  return { status, errorMessage }
}
