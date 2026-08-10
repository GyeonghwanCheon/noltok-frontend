import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { FriendReceivedListResponse } from '@/features/friend/types'

async function fetchReceivedFriendRequests(cursor: number | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<FriendReceivedListResponse>>(
    '/api/v1/friends/received',
    { params: { cursor, size } },
  )
  return data.data
}

export function useReceivedFriendRequests() {
  return useInfiniteQuery({
    queryKey: ['friends', 'received'],
    queryFn: ({ pageParam }) => fetchReceivedFriendRequests(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  })
}
