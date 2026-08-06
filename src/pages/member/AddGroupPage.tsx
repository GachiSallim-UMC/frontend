import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupPageShell } from './GroupPageShell';
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
    type: '',
    maxMemberCount: 2,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddGroupDto, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const handleFormChange = (field: keyof AddGroupDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
  };

  const handleCreateGroup = () => {
    const nextErrors: Partial<Record<keyof AddGroupDto, string>> = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) nextErrors.name = '그룹 이름을 입력해 주세요.';
    else if (trimmedName.length > 40) nextErrors.name = '그룹 이름은 40자 이하로 입력해 주세요.';
    if (formData.description.length > 255) {
      nextErrors.description = '그룹 설명은 255자 이하로 입력해 주세요.';
    }
    if (!formData.type) nextErrors.type = '거주 유형을 선택해 주세요.';
    if (
      !Number.isInteger(formData.maxMemberCount) ||
      formData.maxMemberCount < 2 ||
      formData.maxMemberCount > 12
    ) {
      nextErrors.maxMemberCount = '최대 인원은 2명부터 12명까지 선택할 수 있습니다.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const requestPayload = {
      name: formData.name,
      description: formData.description,
      maxMembers: Number(formData.maxMemberCount),
      residenceType: formData.type || undefined,
    };

    createGroupMutation.mutate(requestPayload, {
      onSuccess: res => {
        const newGroupId = res?.id;
        const newInviteCode = res?.inviteCode;

        if (newGroupId) {
          setSelectedGroupId(newGroupId);
        }

        queryClient.invalidateQueries({ queryKey: ['my-groups'] });

        if (newInviteCode) {
          setInviteCode(newInviteCode);
        } else {
          setInviteCode('코드 발급 오류');
        }
        setIsCreated(true);
      },
      onError: () => {
        setSubmitError('그룹 생성에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  const handleEnterDashboard = () => {
    const currentGroupId = useGroupStore.getState().selectedGroupId;
    if (!currentGroupId) {
      setSubmitError('그룹 정보가 아직 반영되지 않았습니다. 잠시 후 다시 시도해주세요.');
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
    setCopyMessage('초대 코드가 복사되었습니다.');
    setTimeout(() => {
      setCopyMessage(null);
    }, 3000);
  };

  return (
    <GroupPageShell
      title="새 그룹 만들기"
      footer={
        <AddGroupActions
          isCreated={isCreated}
          onCreate={handleCreateGroup}
          onEnter={handleEnterDashboard}
          onCancel={handleCancel}
          isSubmitting={createGroupMutation.isPending}
        />
      }
    >
      <h2 className="mb-5 text-base font-bold tracking-[0.04em] text-gray-900 lg:text-2xl lg:tracking-normal">
        기본 정보
      </h2>

      <AddGroupInput
        formData={formData}
        onChange={handleFormChange}
        errors={errors}
        disabled={isCreated || createGroupMutation.isPending}
      />

      <div className="mt-5">
        <InvitationCodeBox
          isCreated={isCreated}
          inviteCode={inviteCode}
          onCopyCode={handleCopyCode}
        />
      </div>

      {copyMessage && (
        <p className="mt-3 text-center text-mobile-label text-primary-600 lg:text-sm">
          {copyMessage}
        </p>
      )}
      {submitError && (
        <p className="mt-3 text-center text-mobile-label text-red-700 lg:text-sm">{submitError}</p>
      )}
    </GroupPageShell>
  );
};
