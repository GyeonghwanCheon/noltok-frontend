import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useMyInfo } from '@/features/user/hooks/useMyInfo'
import { useUpdateProfile } from '@/features/user/hooks/useUpdateProfile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

const editProfileSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2~10자로 입력해주세요.')
    .max(10, '닉네임은 2~10자로 입력해주세요.'),
  profileImageUrl: z.string(),
})

type EditProfileFormValues = z.infer<typeof editProfileSchema>

export function EditProfileForm() {
  const navigate = useNavigate()
  const { data } = useMyInfo()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    values: data
      ? { nickname: data.nickname, profileImageUrl: data.profileImageUrl ?? '' }
      : undefined,
  })
  const { mutate: updateProfile, isPending, isSuccess, error } = useUpdateProfile()

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
      onSubmit={handleSubmit((values) =>
        updateProfile({
          nickname: values.nickname,
          profileImageUrl: values.profileImageUrl || undefined,
        }),
      )}
      className="mx-auto flex w-full max-w-sm flex-col gap-6 pt-10"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
          <Input id="nickname" type="text" {...register('nickname')} />
          <FieldError errors={[errors.nickname]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profileImageUrl">프로필 이미지 URL</FieldLabel>
          <Input id="profileImageUrl" type="text" {...register('profileImageUrl')} />
          <FieldError errors={[errors.profileImageUrl]} />
        </Field>
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
        <Button type="submit" disabled={isPending}>
          저장
        </Button>
      </FieldGroup>
    </form>
  )
}
