import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatRoomReadResponse } from '@/features/chatroom/types'

async function markAsRead(roomId: number) {
  const { data } = await apiClient.patch<ApiResponse<ChatRoomReadResponse>>(
    `/api/v1/chat/rooms/${roomId}/read`,
  )
  return data.data
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
    },
  })
}
