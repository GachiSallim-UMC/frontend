import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMyGroups } from '@/features/member';
import { useGroupStore } from '@/shared/store';

export const RequireGroup = () => {
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const clearSelectedGroup = useGroupStore(s => s.clearSelectedGroup);
  const { data: groups, isLoading, isError } = useMyGroups();
  const isValidSelection = Boolean(selectedGroupId && groups.some(group => group.id === selectedGroupId));

  useEffect(() => {
    if (!isLoading && selectedGroupId && !isValidSelection) {
      clearSelectedGroup();
    }
  }, [clearSelectedGroup, isLoading, isValidSelection, selectedGroupId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-100">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <span className="ml-3 text-sm text-gray-600">선택한 그룹을 확인하는 중입니다</span>
      </div>
    );
  }

  if (isError || !isValidSelection) {
    return <Navigate to="/group" replace />;
  }

  return <Outlet />;
};
