import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupPageHeader } from './GroupPageHeader';
import { useQueryClient } from '@tanstack/react-query';
import {
  type AddGroupDto,
  AddGroupActions,
  AddGroupInput,
  InvitationCodeBox,
  useCreateGroup,
} from '@/features/member';
import { useGroupStore } from '@/shared/store';

export const AddGroupPage = () => {
  const navigate = useNavigate();
  const createGroupMutation = useCreateGroup();
  const setSelectedGroupId = useGroupStore(s => s.setSelectedGroupId);
  const queryClient = useQueryClient();

  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [formData, setFormData] = useState<AddGroupDto>({
    name: '',
    description: '',
    type: 'roommate',
    maxMemberCount: 1,
  });

  const handleFormChange = (field: keyof AddGroupDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateGroup = () => {
    if (!formData.name.trim()) {
      alert('그룹 이름을 입력해주세요.');
      return;
    }

    const requestPayload = {
      name: formData.name,
      description: formData.description,
      maxMembers: Number(formData.maxMemberCount),
    };

    createGroupMutation.mutate(requestPayload, {
      onSuccess: res => {
        const newGroupId = res?.id;
        const newInviteCode = res?.inviteCode;

        if (newGroupId) {
          setSelectedGroupId(newGroupId);
        }

        queryClient.invalidateQueries({ queryKey: ['my-groups'] });

        setInviteCode(newInviteCode || '코드가 발급되었습니다.');
        setIsCreated(true);
      },
      onError: error => {
        alert('그룹 생성에 실패했습니다. 다시 시도해주세요.');
        console.error(error);
      },
    });
  };

  const handleEnterDashboard = () => {
    const currentGroupId = useGroupStore.getState().selectedGroupId;
    console.log('현재 스토어에 저장된 그룹 ID:', currentGroupId);

    if (!currentGroupId) {
      alert('그룹 정보가 아직 반영되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCopyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    alert('초대 코드가 복사되었습니다.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-100">
      <div className="flex h-[696px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
        <GroupPageHeader />
        <div className="px-10 py-7">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">새 그룹 만들기</h2>

          <AddGroupInput
            formData={formData}
            onChange={handleFormChange}
            disabled={isCreated || createGroupMutation.isPending}
          />

          <InvitationCodeBox
            isCreated={isCreated}
            inviteCode={inviteCode}
            onCopyCode={handleCopyCode}
          />

          <AddGroupActions
            isCreated={isCreated}
            onCreate={handleCreateGroup}
            onEnter={handleEnterDashboard}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};
