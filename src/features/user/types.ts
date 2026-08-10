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

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UserSummaryResponse {
  userId: number
  nickname: string
  profileImageUrl: string | null
}

export interface DeleteAccountResponse {
  userId: number
}
