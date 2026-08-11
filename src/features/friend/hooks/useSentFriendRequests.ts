import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { FriendSentListResponse } from '@/features/friend/types'

async function fetchSentFriendRequests(cursor: number | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<FriendSentListResponse>>(
    '/api/v1/friends/sent',
    { params: { cursor, size } },
  )
  return data.data
}

export function useSentFriendRequests() {
  return useInfiniteQuery({
    queryKey: ['friends', 'sent'],
    queryFn: ({ pageParam }) => fetchSentFriendRequests(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  })
}
