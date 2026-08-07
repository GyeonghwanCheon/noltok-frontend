import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일은 필수입니다.')
    .email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(1, '비밀번호는 필수입니다.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const { mutate: login, isPending, isSuccess, error } = useLogin()

  useEffect(() => {
    if (isSuccess) {
      navigate('/')
    }
  }, [isSuccess, navigate])

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message
    : undefined

  return (
    <form
      onSubmit={handleSubmit((values) => login(values))}
      className="mx-auto flex w-full max-w-sm flex-col gap-6"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">이메일</FieldLabel>
          <Input id="email" type="email" {...register('email')} />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">비밀번호</FieldLabel>
          <Input id="password" type="password" {...register('password')} />
          <FieldError errors={[errors.password]} />
        </Field>
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
        <Button type="submit" disabled={isPending}>
          로그인
        </Button>
      </FieldGroup>
    </form>
  )
}
