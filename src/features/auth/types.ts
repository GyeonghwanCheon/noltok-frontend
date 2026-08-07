export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export interface SignupResponse {
  userId: number
  email: string
  nickname: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}
