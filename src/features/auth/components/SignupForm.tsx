import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { useSignup } from '@/features/auth/hooks/useSignup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일은 필수입니다.')
    .email('이메일 형식이 올바르지 않습니다.'),
  password: z
    .string()
    .min(1, '비밀번호는 필수입니다.')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
      '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
    ),
  nickname: z
    .string()
    .min(1, '닉네임은 필수입니다.')
    .min(2, '닉네임은 2~10자로 입력해주세요.')
    .max(10, '닉네임은 2~10자로 입력해주세요.'),
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) })
  const { mutate: signup, isPending, isSuccess, error } = useSignup()

  if (isSuccess) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 pt-10">
        <p>가입 완료, 로그인해주세요.</p>
        <Button asChild>
          <Link to="/login">로그인하러 가기</Link>
        </Button>
      </div>
    )
  }

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message
    : undefined

  return (
    <form
      onSubmit={handleSubmit((values) => signup(values))}
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
        <Field>
          <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
          <Input id="nickname" type="text" {...register('nickname')} />
          <FieldError errors={[errors.nickname]} />
        </Field>
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
        <Button type="submit" disabled={isPending}>
          가입하기
        </Button>
      </FieldGroup>
    </form>
  )
}
