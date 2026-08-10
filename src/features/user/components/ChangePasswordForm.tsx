import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useChangePassword } from '@/features/user/hooks/useChangePassword'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호는 필수입니다.'),
    newPassword: z
      .string()
      .min(1, '새 비밀번호는 필수입니다.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인은 필수입니다.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) })
  const { mutate: changePassword, isPending, isSuccess, error } = useChangePassword()

  useEffect(() => {
    if (isSuccess) {
      navigate('/me')
    }
  }, [isSuccess, navigate])

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message
    : undefined

  return (
    <form
      onSubmit={handleSubmit((values) => changePassword(values))}
      className="mx-auto flex w-full max-w-sm flex-col gap-6 pt-10"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="currentPassword">현재 비밀번호</FieldLabel>
          <Input id="currentPassword" type="password" {...register('currentPassword')} />
          <FieldError errors={[errors.currentPassword]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="newPassword">새 비밀번호</FieldLabel>
          <Input id="newPassword" type="password" {...register('newPassword')} />
          <FieldError errors={[errors.newPassword]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">새 비밀번호 확인</FieldLabel>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
        <Button type="submit" disabled={isPending}>
          변경하기
        </Button>
      </FieldGroup>
    </form>
  )
}
