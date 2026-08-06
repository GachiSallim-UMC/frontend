import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CheckboxGroup, type CheckboxOption } from '@/shared/components';
import { type PermissionType } from '@/features/member';
import { memberApi } from '@/features/member/api/member.api';
import { useGroupStore } from '@/shared/store';

export type PermissionKey =
  | 'allowChoreRegistration'
  | 'allowItemStatusChange'
  | 'allowSettlementRegistration';

const PERMISSION_LEFT_OPTIONS: CheckboxOption<PermissionType>[] = [
  { value: 'allowChoreRegistration', label: '멤버의 집안일 등록 허용' },
  { value: 'allowItemStatusChange', label: '멤버의 공용 물품 상태 변경 허용' },
  { value: 'allowSettlementRegistration', label: '멤버의 정산 등록 허용' },
];

interface PermissionSettingsProps {
  isAdmin?: boolean;
  onUnauthorized?: () => void;
}

export const PermissionSettings = ({
  isAdmin = false,
  onUnauthorized,
}: PermissionSettingsProps) => {
  const queryClient = useQueryClient();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionType[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const { data: permissionsData } = useQuery({
    queryKey: ['group-permissions', selectedGroupId],
    queryFn: () => memberApi.getGroupPermissions(selectedGroupId as string),
    enabled: Boolean(selectedGroupId),
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: (payload: Record<PermissionKey, boolean>) =>
      memberApi.updateGroupPermissions({ groupId: selectedGroupId as string, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-permissions', selectedGroupId] });
      setPermissionError(null);
    },
    onError: () => {
      setPermissionError('권한 설정 변경에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (permissionsData) {
      const activePermissions: PermissionKey[] = [];
      if (permissionsData.allowChoreRegistration) activePermissions.push('allowChoreRegistration');
      if (permissionsData.allowItemStatusChange) activePermissions.push('allowItemStatusChange');
      if (permissionsData.allowSettlementRegistration)
        activePermissions.push('allowSettlementRegistration');

      setSelectedPermissions(activePermissions);
    }
  }, [permissionsData]);

  const handlePermissionsChange = (newPermissions: PermissionKey[]) => {
    if (!isAdmin) {
      if (onUnauthorized) onUnauthorized();
      return;
    }
    setPermissionError(null);
    setSelectedPermissions(newPermissions);

    if (!selectedGroupId) return;

    const payload: Record<PermissionKey, boolean> = {
      allowChoreRegistration: newPermissions.includes('allowChoreRegistration'),
      allowItemStatusChange: newPermissions.includes('allowItemStatusChange'),
      allowSettlementRegistration: newPermissions.includes('allowSettlementRegistration'),
    };

    updatePermissionsMutation.mutate(payload);
  };

  return (
    <section className="flex w-full flex-col bg-transparent px-4 pt-0 md:rounded-2xl md:bg-white md:p-7">
      <h3 className="mb-[8px] md:mb-5 text-[14px] md:text-lg font-bold text-gray-900 leading-snug">
        권한 설정
      </h3>

      <div
        className="grid grid-cols-1 rounded-xl border border-gray-100 bg-white 
      px-3 md:grid-cols-3 md:gap-x-6 md:rounded-none md:border-none md:bg-transparent md:p-0"
      >
        {PERMISSION_LEFT_OPTIONS.map((option, index) => (
          <div
            key={option.value}
            className={`flex h-[44px] items-center md:h-auto md:block 
            [&_span]:!text-[12px] [&_span]:!text-gray-700 md:[&_span]:!text-[16px] md:[&_span]:!text-gray-900
            [&_input]:!h-[16px] [&_input]:!w-[16px] md:[&_input]:!h-[20px] md:[&_input]:!w-[20px]
            ${
              index !== PERMISSION_LEFT_OPTIONS.length - 1
                ? 'border-b border-gray-100 md:border-none'
                : ''
            }`}
          >
            <CheckboxGroup
              key={option.value}
              direction="col"
              options={[option]}
              value={selectedPermissions}
              onChange={handlePermissionsChange}
            />
          </div>
        ))}
      </div>
      {permissionError && <span className="mt-4 text-sm text-red-700">{permissionError}</span>}
      <div className="mt-5 w-full border-b border-gray-100 md:hidden" />
    </section>
  );
};
