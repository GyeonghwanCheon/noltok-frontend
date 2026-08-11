import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { JoinRoomResponse } from '@/features/chatroom/types'

interface JoinRoomVariables {
  roomId: number
  password?: string
}

async function joinRoom({ roomId, password }: JoinRoomVariables) {
  const { data } = await apiClient.post<ApiResponse<JoinRoomResponse>>(
    `/api/v1/chat/rooms/${roomId}/join`,
    password ? { password } : {},
  )
  return data.data
}

export function useJoinRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: joinRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
    },
  })
}
