import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { clearTokens } from '@/features/auth/tokenStorage'
import { useDeleteAccount } from '@/features/user/hooks/useDeleteAccount'
import { Button } from '@/components/ui/button'

export function DeleteAccount() {
  const navigate = useNavigate()
  const { mutate: deleteAccount, isPending, error } = useDeleteAccount()

  const handleDelete = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        clearTokens()
        navigate('/')
      },
    })
  }

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message
    : undefined

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pt-10 text-center">
      <p className="text-sm text-muted-foreground">
        탈퇴하면 로그인이 즉시 불가능해집니다.
        <br />
        계정 데이터는 바로 삭제되지 않고 서버에 보존됩니다.
      </p>
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
      <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
        탈퇴하기
      </Button>
    </div>
  )
}
