import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { UpdateProfileRequest, UserResponse } from '@/features/user/types'

async function updateProfile(request: UpdateProfileRequest) {
  const { data } = await apiClient.patch<ApiResponse<UserResponse>>('/api/v1/users/me', request)
  return data.data
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
