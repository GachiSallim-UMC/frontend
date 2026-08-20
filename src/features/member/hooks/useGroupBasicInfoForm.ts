import { useEffect, useState, type ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileImageApi } from '@/shared/api';
import { useAlertStore, useGroupStore } from '@/shared/store';
import { memberApi } from '@/features/member/api/member.api';
import { useGroupDetail, useUpdateGroup } from '@/features/member/hooks/useGroupMutations';
import {
  GROUP_MEMBER_COUNT_ERROR_MESSAGE,
  isValidGroupMemberCount,
} from '@/features/member/constants/member.constants';

type GroupBasicInfoErrors = Partial<Record<'groupName' | 'maxMemberCount' | 'description', string>>;

const GROUP_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const GROUP_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UseGroupBasicInfoFormOptions {
  isAdmin: boolean;
  onUnauthorized?: () => void;
}

export const useGroupBasicInfoForm = ({
  isAdmin,
  onUnauthorized,
}: UseGroupBasicInfoFormOptions) => {
  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const showAlert = useAlertStore(state => state.showAlert);
  const updateGroup = useUpdateGroup();
  const queryClient = useQueryClient();
  const [groupName, setGroupName] = useState('');
  const [maxMemberCount, setMaxMemberCount] = useState('');
  const [description, setDescription] = useState('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<GroupBasicInfoErrors>({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string>();

  const {
    data: groupData,
    isLoading: isGroupLoading,
    isError: isGroupError,
    isFetching: isGroupFetching,
    refetch: refetchGroup,
  } = useGroupDetail(selectedGroupId ?? undefined);

  useEffect(() => {
    if (!groupData) return;
    setGroupName(groupData.name || '');
    setMaxMemberCount(String(groupData.maxMembers || ''));
    setDescription(groupData.description || '');
    setGroupImage(groupData.groupImage || null);
    setSelectedFile(null);
  }, [groupData]);

  useEffect(
    () => () => {
      if (groupImage?.startsWith('blob:')) URL.revokeObjectURL(groupImage);
    },
    [groupImage],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!GROUP_IMAGE_TYPES.includes(file.type)) {
      showAlert({
        title: '지원하지 않는 파일 형식',
        message: 'JPG, PNG 또는 WebP 이미지만 업로드할 수 있습니다.',
      });
      event.target.value = '';
      return;
    }

    if (file.size < 1 || file.size > GROUP_IMAGE_MAX_SIZE) {
      showAlert({
        title: '파일 용량 초과',
        message: '이미지 크기는 5MB 이하로 선택해 주세요.',
      });
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    setGroupImage(URL.createObjectURL(file));
  };

  const clearGroupImage = () => {
    setGroupImage(null);
    setSelectedFile(null);
  };

  const handleSave = () => {
    if (!isAdmin) {
      onUnauthorized?.();
      return;
    }
    if (!selectedGroupId) return;

    const nextErrors: GroupBasicInfoErrors = {};
    const trimmedGroupName = groupName.trim();
    const parsedMaxMemberCount = Number(maxMemberCount);

    if (!trimmedGroupName) nextErrors.groupName = '그룹 이름을 입력해 주세요.';
    else if (trimmedGroupName.length > 40) {
      nextErrors.groupName = '그룹 이름은 40자 이하로 입력해 주세요.';
    }
    if (!isValidGroupMemberCount(parsedMaxMemberCount)) {
      nextErrors.maxMemberCount = GROUP_MEMBER_COUNT_ERROR_MESSAGE;
    }
    if (description.length > 255) {
      nextErrors.description = '그룹 소개는 255자 이하로 입력해 주세요.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSaveError(null);
    setIsUpdateModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!isAdmin) {
      onUnauthorized?.();
      setIsUpdateModalOpen(false);
      return;
    }
    if (!selectedGroupId) return;
    setSaveError(null);
    let finalGroupImageUrl = groupImage;

    try {
      if (selectedFile) {
        setIsUploading(true);
        const uploadData = await profileImageApi.getUploadUrl({
          contentType: selectedFile.type,
          fileSize: selectedFile.size,
        });
        finalGroupImageUrl = await profileImageApi.uploadToS3(uploadData, selectedFile);
      }

      updateGroup.mutate(
        {
          groupId: selectedGroupId,
          body: {
            name: groupName.trim(),
            description,
            maxMembers: Number(maxMemberCount),
            groupImage: finalGroupImageUrl,
          },
        },
        {
          onSuccess: () => {
            setGroupImage(finalGroupImageUrl);
            setSelectedFile(null);
            setIsUploading(false);
            setIsUpdateModalOpen(false);
          },
          onError: () => {
            setSaveError('그룹 정보 수정에 실패했습니다. 다시 시도해 주세요.');
            setIsUploading(false);
          },
        },
      );
    } catch {
      setSaveError('이미지 저장 중 오류가 발생했습니다.');
      setIsUploading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!groupData?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(groupData.inviteCode);
    } catch {
      showAlert({
        title: '복사 실패',
        message: '그룹 코드를 복사하지 못했습니다. 다시 시도해 주세요.',
      });
    }
  };

  const regenerateCode = useMutation({
    mutationFn: () => memberApi.regenerateInviteCode(selectedGroupId as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['group', selectedGroupId] });
      setCodeError(undefined);
    },
    onError: () => setCodeError('초대 코드 재발급에 실패했습니다.'),
  });

  const handleRegenerateCode = () => {
    if (!isAdmin) {
      onUnauthorized?.();
      return;
    }
    if (!selectedGroupId) return;
    setCodeError(undefined);
    regenerateCode.mutate();
  };

  return {
    groupData,
    isGroupLoading,
    isGroupError,
    isGroupFetching,
    refetchGroup,
    groupName,
    setGroupName,
    maxMemberCount,
    setMaxMemberCount,
    description,
    setDescription,
    groupImage,
    errors,
    setErrors,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    saveError,
    setSaveError,
    codeError,
    handleFileChange,
    clearGroupImage,
    handleSave,
    handleConfirmSave,
    handleCopyCode,
    handleRegenerateCode,
    isRegeneratingCode: regenerateCode.isPending,
    isSaving: updateGroup.isPending || isUploading,
  };
};
