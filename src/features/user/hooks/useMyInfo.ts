import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { UserResponse } from '@/features/user/types'

async function fetchMyInfo() {
  const { data } = await apiClient.get<ApiResponse<UserResponse>>('/api/v1/users/me')
  return data.data
}

export function useMyInfo(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMyInfo,
    enabled: options?.enabled ?? true,
  })
}
