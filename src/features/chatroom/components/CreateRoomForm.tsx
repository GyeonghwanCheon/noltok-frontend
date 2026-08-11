import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useFriends } from '@/features/friend/hooks/useFriends'
import { useCreateRoom } from '@/features/chatroom/hooks/useCreateRoom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { CreateRoomRequest } from '@/features/chatroom/types'

const createRoomSchema = z
  .object({
    type: z.enum(['DIRECT', 'GROUP', 'OPEN', 'OPEN_PRIVATE']),
    roomname: z.string().max(100, '방 이름은 100자 이하로 입력해주세요.').optional(),
    password: z.string().optional(),
    directNickname: z.string().optional(),
    groupNicknames: z.array(z.string()).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type !== 'DIRECT' && !values.roomname?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['roomname'], message: '방 이름은 필수입니다.' })
    }
    if (values.type === 'DIRECT' && !values.directNickname) {
      ctx.addIssue({ code: 'custom', path: ['directNickname'], message: '대화 상대를 선택해주세요.' })
    }
    if (values.type === 'GROUP' && !values.groupNicknames?.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['groupNicknames'],
        message: '초대할 친구를 1명 이상 선택해주세요.',
      })
    }
    if (values.type === 'OPEN_PRIVATE' && (values.password?.length ?? 0) < 4) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: '비밀번호는 4자리 이상이어야 합니다.',
      })
    }
  })

type CreateRoomFormValues = z.infer<typeof createRoomSchema>

export function CreateRoomForm() {
  const navigate = useNavigate()
  const { data: friendsData } = useFriends()
  const friends = friendsData?.pages.flatMap((page) => page.friends) ?? []

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { type: 'GROUP' },
  })
  const type = watch('type')

  const { mutate: createRoom, isPending, isSuccess, error } = useCreateRoom()

  useEffect(() => {
    if (isSuccess) {
      navigate('/rooms')
    }
  }, [isSuccess, navigate])

  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message
    : undefined

  const onSubmit = (values: CreateRoomFormValues) => {
    const request: CreateRoomRequest = { type: values.type }
    if (values.type === 'DIRECT') {
      request.nicknames = values.directNickname ? [values.directNickname] : []
    } else {
      request.roomname = values.roomname
      if (values.type === 'GROUP') {
        request.nicknames = values.groupNicknames
      }
      if (values.type === 'OPEN_PRIVATE') {
        request.password = values.password
      }
    }
    createRoom(request)
  }

  const needsFriends = type === 'DIRECT' || type === 'GROUP'
  const noFriends = needsFriends && friends.length === 0

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-sm flex-col gap-6 pt-10"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="type">채팅방 종류</FieldLabel>
          <select
            id="type"
            {...register('type')}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none dark:bg-input/30"
          >
            <option value="GROUP">그룹</option>
            <option value="DIRECT">1:1</option>
            <option value="OPEN">공개</option>
            <option value="OPEN_PRIVATE">비밀번호 방</option>
          </select>
        </Field>

        {type !== 'DIRECT' && (
          <Field>
            <FieldLabel htmlFor="roomname">방 이름</FieldLabel>
            <Input id="roomname" {...register('roomname')} />
            <FieldError errors={[errors.roomname]} />
          </Field>
        )}

        {type === 'OPEN_PRIVATE' && (
          <Field>
            <FieldLabel htmlFor="password">비밀번호</FieldLabel>
            <Input id="password" type="password" {...register('password')} />
            <FieldError errors={[errors.password]} />
          </Field>
        )}

        {type === 'DIRECT' && (
          <Field>
            <FieldLabel htmlFor="directNickname">대화 상대</FieldLabel>
            <select
              id="directNickname"
              {...register('directNickname')}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none dark:bg-input/30"
            >
              <option value="">친구를 선택하세요</option>
              {friends.map((friend) => (
                <option key={friend.friendId} value={friend.nickname}>
                  {friend.nickname}
                </option>
              ))}
            </select>
            <FieldError errors={[errors.directNickname]} />
          </Field>
        )}

        {type === 'GROUP' && (
          <Field>
            <FieldLabel htmlFor="groupNicknames">초대할 친구</FieldLabel>
            <Controller
              control={control}
              name="groupNicknames"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  {friends.map((friend) => {
                    const checked = field.value?.includes(friend.nickname) ?? false
                    return (
                      <label key={friend.friendId} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const current = field.value ?? []
                            field.onChange(
                              event.target.checked
                                ? [...current, friend.nickname]
                                : current.filter((nickname) => nickname !== friend.nickname),
                            )
                          }}
                        />
                        {friend.nickname}
                      </label>
                    )
                  })}
                </div>
              )}
            />
            <FieldError errors={[errors.groupNicknames]} />
          </Field>
        )}

        {noFriends && (
          <p className="text-sm text-muted-foreground">
            초대 가능한 친구가 없습니다. 먼저 친구를 추가해주세요.
          </p>
        )}

        {errorMessage && <FieldError>{errorMessage}</FieldError>}

        <Button type="submit" disabled={isPending || noFriends}>
          만들기
        </Button>
      </FieldGroup>
    </form>
  )
}
