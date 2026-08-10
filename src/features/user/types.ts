export interface UserResponse {
  userId: number
  email: string
  nickname: string
  profileImageUrl: string | null
  createdAt: string
}

export interface UpdateProfileRequest {
  nickname?: string
  profileImageUrl?: string
}
