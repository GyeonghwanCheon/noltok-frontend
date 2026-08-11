import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatRoomLeaveResponse } from '@/features/chatroom/types'

async function leaveRoom(roomId: number) {
  const { data } = await apiClient.delete<ApiResponse<ChatRoomLeaveResponse>>(
    `/api/v1/chat/rooms/${roomId}/leave`,
  )
  return data.data
}

export function useLeaveRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: leaveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
    },
  })
}
