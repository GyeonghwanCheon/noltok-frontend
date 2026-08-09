import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

async function logout(accessToken: string) {
  await apiClient.post('/api/v1/auth/logout', null, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  })
}
