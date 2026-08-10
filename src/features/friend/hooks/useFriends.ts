import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { FriendListResponse } from '@/features/friend/types'

async function fetchFriends(cursor: number | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<FriendListResponse>>('/api/v1/friends', {
    params: { cursor, size },
  })
  return data.data
}

export function useFriends() {
  return useInfiniteQuery({
    queryKey: ['friends'],
    queryFn: ({ pageParam }) => fetchFriends(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  })
}
