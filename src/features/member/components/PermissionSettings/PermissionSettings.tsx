import { useState, useEffect } from 'react';
import { Button, CheckboxGroup, type CheckboxOption } from '@/shared/components';
import { useGroupStore } from '@/shared/store';
import { useGroupPermissions, useUpdateGroupPermissions } from '../../hooks/useGroupMutations';
import type { PermissionType, UpdateGroupPermissionsDto } from '../../types/member.types';

const PERMISSION_LEFT_OPTIONS: CheckboxOption<PermissionType>[] = [
  { value: 'allowChoreRegistration', label: '멤버의 집안일 등록 허용' },
  { value: 'allowItemStatusChange', label: '멤버의 공용 물품 상태 변경 허용' },
  { value: 'allowSettlementRegistration', label: '멤버의 정산 등록 허용' },
  { value: 'autoApproveNewMembers', label: '신규 멤버 자동 승인' },
];

const toSelectedPermissions = (permissions: {
  allowChoreRegistration: boolean;
  allowItemStatusChange: boolean;
  allowSettlementRegistration: boolean;
  autoApproveNewMembers: boolean;
}): PermissionType[] =>
  PERMISSION_LEFT_OPTIONS.filter(option => permissions[option.value]).map(option => option.value);

interface PermissionSettingsProps {
  isAdmin?: boolean;
  onUnauthorized?: () => void;
}

export const PermissionSettings = ({ isAdmin = false }: PermissionSettingsProps) => {
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionType[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const permissionsQuery = useGroupPermissions(selectedGroupId ?? undefined);
  const updatePermissionsMutation = useUpdateGroupPermissions();
  const permissionsData = permissionsQuery.data;

  useEffect(() => {
    if (permissionsData) setSelectedPermissions(toSelectedPermissions(permissionsData));
  }, [permissionsData]);

  const handlePermissionsChange = (newPermissions: PermissionType[]) => {
    setPermissionError(null);
    setSelectedPermissions(newPermissions);

    if (!selectedGroupId) return;

    const payload: UpdateGroupPermissionsDto = {
      allowChoreRegistration: newPermissions.includes('allowChoreRegistration'),
      allowItemStatusChange: newPermissions.includes('allowItemStatusChange'),
      allowSettlementRegistration: newPermissions.includes('allowSettlementRegistration'),
      autoApproveNewMembers: newPermissions.includes('autoApproveNewMembers'),
    };

    updatePermissionsMutation.mutate(
      { groupId: selectedGroupId, payload },
      {
        onSuccess: () => setPermissionError(null),
        onError: () => {
          setPermissionError('권한 설정 변경에 실패했습니다.');
          if (permissionsData) setSelectedPermissions(toSelectedPermissions(permissionsData));
          void permissionsQuery.refetch();
        },
      },
    );
  };

  if (permissionsQuery.isLoading) {
    return (
      <section className="flex min-h-32 w-full items-center justify-center rounded-2xl bg-white p-7">
        <span className="text-sm text-gray-500">권한 설정을 불러오는 중...</span>
      </section>
    );
  }

  if (permissionsQuery.isError || !permissionsData) {
    return (
      <section className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl bg-white p-7 text-center">
        <span className="text-sm text-red-700">권한 설정을 불러오지 못했습니다.</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          isLoading={permissionsQuery.isFetching}
          onClick={() => void permissionsQuery.refetch()}
        >
          다시 시도
        </Button>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col bg-transparent lg:rounded-2xl lg:bg-white lg:p-7">
      <h3 className="mb-[8px] lg:mb-5 text-[14px] lg:text-lg font-bold text-gray-900 leading-snug">
        권한 설정
      </h3>

      <div
        className="grid grid-cols-1 rounded-lg border border-gray-100 bg-white
      px-3 lg:grid-cols-2 lg:gap-x-6 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0"
      >
        {PERMISSION_LEFT_OPTIONS.map((option, index) => (
          <div
            key={option.value}
            className={`flex h-[44px] items-center lg:h-auto lg:block
            ${
              index !== PERMISSION_LEFT_OPTIONS.length - 1
                ? 'border-b border-gray-100 lg:border-none'
                : ''
            }`}
          >
            <CheckboxGroup
              key={option.value}
              direction="col"
              options={[option]}
              value={selectedPermissions}
              onChange={handlePermissionsChange}
              size="sm"
              disabled={!isAdmin || updatePermissionsMutation.isPending}
            />
          </div>
        ))}
      </div>
      {permissionError && <span className="mt-4 text-sm text-red-700">{permissionError}</span>}
      <div className="mt-5 w-full border-b border-gray-100 lg:hidden" />
    </section>
  );
};
