import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatRoomResponse, CreateRoomRequest } from '@/features/chatroom/types'

async function createRoom(request: CreateRoomRequest) {
  const { data } = await apiClient.post<ApiResponse<ChatRoomResponse>>(
    '/api/v1/chat/rooms',
    request,
  )
  return data.data
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
    },
  })
}
