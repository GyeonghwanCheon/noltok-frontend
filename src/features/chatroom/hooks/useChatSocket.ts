import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAccessToken } from '@/features/auth/tokenStorage'

type ConnectionStatus = 'connecting' | 'connected' | 'error'

export function useChatSocket(roomId: number) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    setStatus('connecting')
    setErrorMessage(undefined)

    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${getAccessToken()}` },
      reconnectDelay: 0,
      onConnect: () => {
        client.subscribe(`/user/queue/rooms/${roomId}`, () => {})
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
