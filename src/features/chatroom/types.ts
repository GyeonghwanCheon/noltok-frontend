export type ChatRoomType = 'DIRECT' | 'GROUP' | 'OPEN' | 'OPEN_PRIVATE'

export interface ChatRoomSummaryDto {
  roomId: number
  roomname: string | null
  type: ChatRoomType
  myRole: 'ADMIN' | 'MEMBER'
  lastMessage: string | null
  unreadCount: number
  updatedAt: string
}

export interface ChatRoomListResponse {
  rooms: ChatRoomSummaryDto[]
  hasNext: boolean
  nextCursorTimestamp: string | null
  nextCursorRoomId: number | null
}

export interface CreateRoomRequest {
  roomname?: string
  type: ChatRoomType
  password?: string
  nicknames?: string[]
}

export interface ChatRoomResponse {
  roomId: number
  roomname: string | null
  type: ChatRoomType
  memberCount: number
  myRole: 'ADMIN' | 'MEMBER'
  createdAt: string
}

export interface SearchRoomDto {
  roomId: number
  roomname: string
  type: Extract<ChatRoomType, 'OPEN' | 'OPEN_PRIVATE'>
  memberCount: number
}

export interface ChatRoomSearchResponse {
  rooms: SearchRoomDto[]
  hasNext: boolean
  nextCursor: number | null
}

export interface JoinRoomResponse {
  roomId: number
  myRole: 'MEMBER'
  message: string
}

export interface ChatRoomLeaveResponse {
  roomId: number
  message: string
}

export interface ChatRoomReadResponse {
  roomId: number
  lastReadMessageId: number
}
