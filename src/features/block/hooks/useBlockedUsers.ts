import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { BlockListResponse } from '@/features/block/types'

async function fetchBlockedUsers(cursor: number | undefined, size = 20) {
  const { data } = await apiClient.get<ApiResponse<BlockListResponse>>('/api/v1/blocks', {
    params: { cursor, size },
  })
  return data.data
}

export function useBlockedUsers() {
  return useInfiniteQuery({
    queryKey: ['blocks'],
    queryFn: ({ pageParam }) => fetchBlockedUsers(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  })
}
