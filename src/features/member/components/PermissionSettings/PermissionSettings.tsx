import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CheckboxGroup, type CheckboxOption } from '@/shared/components';
import { type PermissionType, type MemberRole, useGroupMembers } from '@/features/member';
import { memberApi } from '@/features/member/api/member.api';
import { useGroupStore, useAuthStore } from '@/shared/store';

export type PermissionKey =
  | 'allowChoreRegistration'
  | 'allowItemStatusChange'
  | 'allowSettlementRegistration'
  | 'autoApproveNewMembers';

const PERMISSION_LEFT_OPTIONS: CheckboxOption<PermissionType>[] = [
  { value: 'allowChoreRegistration', label: '멤버의 집안일 등록 허용' },
  { value: 'allowItemStatusChange', label: '멤버의 공용 물품 상태 변경 허용' },
];

const PERMISSION_RIGHT_OPTIONS: CheckboxOption<PermissionType>[] = [
  { value: 'allowSettlementRegistration', label: '멤버의 정산 등록 허용' },
  { value: 'autoApproveNewMembers', label: '신규 멤버 자동 승인 (관리자 승인 생략)' },
];

export const PermissionSettings = () => {
  const queryClient = useQueryClient();
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const myUserId = useAuthStore(s => s.userId);
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionType[]>([]);

  const { data: members } = useGroupMembers(selectedGroupId);
  const myInfo = members.find(member => member.userId === myUserId);
  const isAdmin = (myInfo?.role as MemberRole) === 'ADMIN';

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
    },
    onError: error => {
      alert('권한 설정 변경에 실패했습니다.');
      console.error(error);
    },
  });

  useEffect(() => {
    if (permissionsData) {
      const activePermissions: PermissionKey[] = [];
      if (permissionsData.allowChoreRegistration) activePermissions.push('allowChoreRegistration');
      if (permissionsData.allowItemStatusChange) activePermissions.push('allowItemStatusChange');
      if (permissionsData.allowSettlementRegistration)
        activePermissions.push('allowSettlementRegistration');
      if (permissionsData.autoApproveNewMembers) activePermissions.push('autoApproveNewMembers');

      setSelectedPermissions(activePermissions);
    }
  }, [permissionsData]);

  const handlePermissionsChange = (newPermissions: PermissionKey[]) => {
    if (!isAdmin) {
      alert('관리자만 권한을 설정할 수 있습니다.');
      return;
    }

    setSelectedPermissions(newPermissions);

    if (!selectedGroupId) return;

    const payload: Record<PermissionKey, boolean> = {
      allowChoreRegistration: newPermissions.includes('allowChoreRegistration'),
      allowItemStatusChange: newPermissions.includes('allowItemStatusChange'),
      allowSettlementRegistration: newPermissions.includes('allowSettlementRegistration'),
      autoApproveNewMembers: newPermissions.includes('autoApproveNewMembers'),
    };

    updatePermissionsMutation.mutate(payload);
  };

  return (
    <section className="flex w-full flex-col rounded-2xl bg-white p-7">
      <h3 className="mb-5 text-lg font-bold text-gray-900 leading-snug">권한 설정</h3>

      <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-12">
        {/* 좌측 체크박스 그룹 */}
        <div className="flex-1">
          <CheckboxGroup
            direction="col"
            options={PERMISSION_LEFT_OPTIONS}
            value={selectedPermissions}
            onChange={handlePermissionsChange}
          />
        </div>

        {/* 우측 체크박스 그룹 */}
        <div className="flex-1">
          <CheckboxGroup
            direction="col"
            options={PERMISSION_RIGHT_OPTIONS}
            value={selectedPermissions}
            onChange={handlePermissionsChange}
          />
        </div>
      </div>
    </section>
  );
};
