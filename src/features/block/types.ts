export interface BlockRequest {
  nickname: string
}

export interface BlockResponse {
  blockId: number
  blockedId: number
  blockedNickname: string
  blockedAt: string
}

export interface BlockedUserDto {
  blockId: number
  userId: number
  nickname: string
  profileImageUrl: string | null
  blockedAt: string
}

export interface BlockListResponse {
  blocks: BlockedUserDto[]
  hasNext: boolean
  nextCursor: number | null
}

export interface UnblockResponse {
  blockId: number
  message: string
}
