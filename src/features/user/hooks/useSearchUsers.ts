import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { UserSummaryResponse } from '@/features/user/types'

async function searchUsers(nickname: string) {
  const { data } = await apiClient.get<ApiResponse<UserSummaryResponse[]>>('/api/v1/users', {
    params: { nickname },
  })
  return data.data
}

export function useSearchUsers(nickname: string) {
  return useQuery({
    queryKey: ['users', 'search', nickname],
    queryFn: () => searchUsers(nickname),
    enabled: nickname.length > 0,
  })
}
