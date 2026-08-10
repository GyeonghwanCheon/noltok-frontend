import { useMyInfo } from '@/features/user/hooks/useMyInfo'

export function MyInfo() {
  const { data, isLoading, isError } = useMyInfo()

  if (isLoading) {
    return <p className="pt-10 text-center">불러오는 중...</p>
  }

  if (isError || !data) {
    return <p className="pt-10 text-center text-destructive">내 정보를 불러오지 못했습니다.</p>
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 pt-10">
      {data.profileImageUrl ? (
        <img
          src={data.profileImageUrl}
          alt="프로필 이미지"
          className="size-20 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl">
          {data.nickname.charAt(0)}
        </div>
      )}
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-medium">{data.nickname}</p>
        <p className="text-sm text-muted-foreground">{data.email}</p>
        <p className="text-sm text-muted-foreground">가입일: {data.createdAt}</p>
      </div>
    </div>
  )
}
