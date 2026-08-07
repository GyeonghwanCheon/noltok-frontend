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
