import { useLogout, useMe } from '@/features/auth';
import { GroupSelectHeader } from '@/features/member';

export const GroupPageHeader = () => {
  const { data: me } = useMe();
  const { mutate: logout, isPending } = useLogout();

  return (
    <GroupSelectHeader
      userName={me?.nickname || me?.name || '사용자'}
      onLogout={() => logout()}
      isLoggingOut={isPending}
    />
  );
};
