export interface BlockRequest {
  nickname: string
}

export interface BlockResponse {
  blockId: number
  blockedId: number
  blockedNickname: string
  blockedAt: string
}
