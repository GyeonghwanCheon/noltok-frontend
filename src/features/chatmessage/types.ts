export type ChatMessageType = 'TEXT' | 'IMAGE' | 'FILE'

export interface ChatMessageResponse {
  messageId: number
  roomId: number
  senderId: number
  senderNickname: string
  senderProfileImageUrl: string | null
  content: string
  type: ChatMessageType
  fileUrl: string | null
  createdAt: string
}

export interface ChatMessageListResponse {
  messages: ChatMessageResponse[]
  hasNext: boolean
  nextCursor: number | null
}
