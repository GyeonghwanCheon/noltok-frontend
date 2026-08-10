export interface FriendDto {
  friendId: number
  userId: number
  nickname: string
  profileImageUrl: string | null
  becameFriendAt: string
}

export interface FriendListResponse {
  friends: FriendDto[]
  hasNext: boolean
  nextCursor: number | null
}

export interface ReceivedFriendRequestDto {
  friendId: number
  requesterId: number
  requesterNickname: string
  requesterProfileImageUrl: string | null
  requestedAt: string
}

export interface FriendReceivedListResponse {
  requests: ReceivedFriendRequestDto[]
  hasNext: boolean
  nextCursor: number | null
}

export interface FriendAcceptResponse {
  friendId: number
  friendNickname: string
  status: 'ACCEPTED'
  message: string
}

export interface FriendRejectResponse {
  friendId: number
  status: 'REJECTED'
  message: string
}

export interface SendFriendRequestRequest {
  nickname: string
}

export interface SendFriendRequestResponse {
  friendId: number
  receiverId: number
  receiverNickname: string
  status: 'PENDING'
  requestedAt: string
}
