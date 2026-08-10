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
