import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { ChatMessageDeleteResponse } from '@/features/chatmessage/types'

interface DeleteMessageParams {
  roomId: number
  messageId: number
}

async function deleteMessage({ roomId, messageId }: DeleteMessageParams) {
  const { data } = await apiClient.delete<ApiResponse<ChatMessageDeleteResponse>>(
    `/api/v1/chat/rooms/${roomId}/messages/${messageId}`,
  )
  return data.data
}

export function useDeleteMessage() {
  return useMutation({
    mutationFn: deleteMessage,
  })
}
