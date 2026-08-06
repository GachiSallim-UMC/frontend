import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Button, FormInput, SelectDropdown } from '@/shared/components';
import { formatDate, useDateFormat } from '@/shared/lib';
import { memberApi } from '@/features/member/api/member.api';
import { useUpdateGroup } from '../../hooks/useGroupMutations';
import { useGroupStore } from '@/shared/store';
import { authApi } from '@/features/auth';
import { RefreshCw } from 'lucide-react';
import { MemberUpdateModal } from '../MemberUpdateModal';

import CameraIcon from '@/assets/icons/member/camera.svg?react';
import UploadIcon from '@/assets/icons/member/upload.svg?react';
import TrashIcon from '@/assets/icons/member/trash.svg?react';
import CopyIcon from '@/assets/icons/member/copy.svg?react';

import RoommateIcon from '@/assets/icons/member/ResidenceType/roommate.svg?react';
import ShareIcon from '@/assets/icons/member/ResidenceType/share.svg?react';
import FamilyIcon from '@/assets/icons/member/ResidenceType/family.svg?react';
import BoardingIcon from '@/assets/icons/member/ResidenceType/boarding.svg?react';
import EtcIcon from '@/assets/icons/member/ResidenceType/etc.svg?react';

interface MemberManagementProps {
  isAdmin?: boolean;
  onUnauthorized?: () => void;
}

export const GroupBasicInfo = ({ isAdmin = false, onUnauthorized }: MemberManagementProps) => {
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const updateGroupMutation = useUpdateGroup();
  const dateFormat = useDateFormat();
  const queryClient = useQueryClient();

  const [groupName, setGroupName] = useState<string>('');
  const [maxMemberCount, setMaxMemberCount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<'groupName' | 'maxMemberCount' | 'description', string>>
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | undefined>(undefined);

  const { data: groupData, refetch } = useQuery({
    queryKey: ['group', selectedGroupId],
    queryFn: () => memberApi.getGroupDetail(selectedGroupId as string),
    enabled: Boolean(selectedGroupId),
  });

  useEffect(() => {
    if (selectedGroupId) {
      refetch();
    }
  }, [selectedGroupId, refetch]);

  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.name || '');
      setMaxMemberCount(String(groupData.maxMembers || ''));
      setDescription(groupData.description || '');
      setGroupImage(groupData.groupImage || null);
    }
  }, [groupData]);

  const maxMemberOptions = [
    { value: '2', label: '2명' },
    { value: '3', label: '3명' },
    { value: '4', label: '4명' },
    { value: '5', label: '5명' },
    { value: '6', label: '6명' },
    { value: '7', label: '7명' },
    { value: '8', label: '8명' },
    { value: '9', label: '9명' },
    { value: '10', label: '10명' },
    { value: '11', label: '11명' },
    { value: '12', label: '12명' },
  ];

  const handleUploadClick = () => {
    setIsMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setGroupImage(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setIsMenuOpen(false);
    setGroupImage(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (!isAdmin) {
      if (onUnauthorized) onUnauthorized();
      return;
    }

    if (!selectedGroupId) return;

    const nextErrors: typeof errors = {};
    const trimmedGroupName = groupName.trim();
    const parsedMaxMemberCount = Number(maxMemberCount);
    if (!trimmedGroupName) nextErrors.groupName = '그룹 이름을 입력해 주세요.';
    else if (trimmedGroupName.length > 40)
      nextErrors.groupName = '그룹 이름은 40자 이하로 입력해 주세요.';
    if (
      !Number.isInteger(parsedMaxMemberCount) ||
      parsedMaxMemberCount < 2 ||
      parsedMaxMemberCount > 12
    ) {
      nextErrors.maxMemberCount = '최대 인원은 2명부터 12명까지 선택해 주세요.';
    }
    if (description.length > 255)
      nextErrors.description = '그룹 소개는 255자 이하로 입력해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setSaveError(null);
    setIsUpdateModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!selectedGroupId) return;
    setSaveError(null);
    let finalGroupImageUrl = groupImage;

    try {
      if (selectedFile) {
        setIsUploading(true);
        const uploadData = await authApi.getUploadUrl({
          contentType: selectedFile.type,
          fileSize: selectedFile.size,
        });
        finalGroupImageUrl = await authApi.uploadToS3(uploadData, selectedFile);
      }

      updateGroupMutation.mutate(
        {
          groupId: selectedGroupId,
          body: {
            name: groupName.trim(),
            description: description,
            maxMembers: Number(maxMemberCount),
            groupImage: finalGroupImageUrl,
          },
        },
        {
          onSuccess: () => {
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

  const handleCopyCode = () => {
    if (!groupData?.inviteCode) return;
    navigator.clipboard.writeText(groupData.inviteCode);
  };

  const regenerateCodeMutation = useMutation({
    mutationFn: () => memberApi.regenerateInviteCode(selectedGroupId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', selectedGroupId] });
      setCodeError(undefined);
    },
    onError: () => {
      setCodeError('초대 코드 재발급에 실패했습니다.');
    },
  });

  const handleRegenerateCode = () => {
    if (!isAdmin) {
      if (onUnauthorized) onUnauthorized();
      return;
    }
    setCodeError(undefined);
    regenerateCodeMutation.mutate();
  };

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        (!bottomSheetRef.current || !bottomSheetRef.current.contains(event.target as Node))
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formattedDate = groupData?.createdAt ? formatDate(groupData.createdAt, dateFormat) : '';

  const renderDefaultIcon = (type?: string) => {
    switch (type) {
      case 'ROOMMATE':
        return <RoommateIcon className="h-full w-full object-cover" />;
      case 'BOARDING':
        return <BoardingIcon className="h-full w-full object-cover" />;
      case 'FAMILY':
        return <FamilyIcon className="h-full w-full object-cover" />;
      case 'SHARE':
        return <ShareIcon className="h-full w-full object-cover" />;
      default:
        return <EtcIcon className="h-full w-full object-cover" />;
    }
  };

  return (
    <section
      className="mx-auto flex w-full max-w-[390px] flex-col items-center bg-transparent
    px-4 pt-0 md:max-w-none md:flex-row md:items-start md:gap-23 md:rounded-2xl md:bg-white md:p-7"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {/* 좌측: 프로필 */}
      <div className="md:mx-20 flex shrink-0 flex-col items-center justify-center md:pt-2">
        <div className="relative mb-[10px] h-[100px] w-[100px] md:mb-4 md:h-[156px] md:w-[156px]">
          {groupImage ? (
            <img
              src={groupImage}
              alt="그룹 프로필"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full overflow-hidden rounded-full bg-primary-200 object-cover">
              {renderDefaultIcon(groupData?.residenceType)}
            </div>
          )}

          {/* 카메라 버튼 및 드롭다운 메뉴 래퍼 */}
          <div ref={menuRef} className="absolute bottom-0 right-0">
            <button
              aria-label="프로필 이미지 변경"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-[30px] w-[30px] md:h-[40px] md:w-[40px] items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100"
            >
              <CameraIcon className="h-[18px] w-[18px] md:h-[24px] md:w-[24px] text-gray-700" />
            </button>

            {/* 팝업 드롭다운 창 -> 데스크탑 전용*/}
            {isMenuOpen && (
              <div className="absolute left-12 top-0 z-20 md:flex hidden w-[180px] flex-col rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900 ring-dropdown">
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  <UploadIcon />
                  사진 업로드
                </button>
                <button
                  onClick={handleImageDelete}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                >
                  <TrashIcon />
                  사진 삭제
                </button>
              </div>
            )}
          </div>
        </div>
        <span className="text-[16px] md:text-[20px] font-bold text-gray-900">
          {groupData?.name || ''}
        </span>
        <span className="text-[10px] md:text-[14px] text-gray-400">생성일: {formattedDate}</span>

        {/* 모바일 전용 -> 데스크탑에서는 숨김*/}
        <div className="mt-[3px] flex items-center justify-center gap-1.5 md:hidden">
          <span className="text-[12px] font-bold uppercase tracking-widest text-primary-700">
            {groupData?.inviteCode || ''}
          </span>
          <button
            type="button"
            onClick={handleRegenerateCode}
            disabled={regenerateCodeMutation.isPending}
            aria-label="그룹 코드 재발급"
            className="flex items-center justify-center text-primary-700 transition-colors hover:text-gray-900 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-[12px] w-[12px] ${regenerateCodeMutation.isPending ? 'animate-spin' : ''}`}
            />
          </button>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="그룹 코드 복사"
            className="flex items-center justify-center text-primary-700 transition-colors hover:text-primary-600"
          >
            <CopyIcon className="h-[12px] w-[12px]" />
          </button>
        </div>
      </div>

      {/* 우측: 그룹 기본 정보 */}
      <div className="flex w-full flex-1 flex-col mt-[15px] md:mt-0">
        <h3 className="mb-5 hidden text-lg font-bold text-gray-900 leading-snug md:block">
          그룹 기본 정보
        </h3>

        {/* 그룹 이름 & 최대 인원 */}
        <div className="flex w-full flex-col gap-[10px] md:mb-5 md:grid md:grid-cols-2">
          <div className="order-1 flex h-full flex-col justify-end md:order-1">
            <label htmlFor="groupName" className="mb-1 text-[14px] font-bold text-gray-900">
              그룹 이름
            </label>
            <FormInput
              id="groupName"
              value={groupName}
              onChange={e => {
                setGroupName(e.target.value);
                setErrors(previous => ({ ...previous, groupName: undefined }));
              }}
              placeholder="그룹 이름을 입력해주세요"
              maxLength={40}
              error={errors.groupName}
              className="h-[44px] md:h-[50px] text-[12px] md:text-[16px]"
            />
          </div>

          {/* 그룹 소개 & 저장 */}
          <div className="order-2 md:order-3 flex flex-col md:col-span-2 md:flex-row md:items-end md:gap-5">
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="description" className="mb-1 text-[14px] font-bold text-gray-900">
                그룹 소개
              </label>
              <FormInput
                id="description"
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  setErrors(previous => ({ ...previous, description: undefined }));
                }}
                placeholder="그룹을 소개하는 한 줄 평을 적어주세요"
                maxLength={255}
                error={errors.description}
                className="h-[44px] md:h-[50px] text-[12px] md:text-[16px]"
              />
            </div>

            <Button
              onClick={handleSave}
              variant="primary"
              className="hidden md:flex w-32 shrink-0 font-bold h-[50px]"
              isLoading={updateGroupMutation.isPending || isUploading}
            >
              저장
            </Button>
          </div>

          <div className="order-3 flex h-full flex-col justify-end md:order-2">
            <SelectDropdown
              id="maxMembers"
              label="최대 인원"
              value={maxMemberCount}
              onChange={value => {
                setMaxMemberCount(value);
                setErrors(previous => ({ ...previous, maxMemberCount: undefined }));
              }}
              options={maxMemberOptions}
              placeholder="인원 선택"
              error={errors.maxMemberCount}
              className="h-[44px] md:h-[50px] text-[12px] md:text-[16px]"
            />
          </div>
          <div className="order-4 mt-[10px] md:hidden">
            <Button
              onClick={handleSave}
              variant="primary"
              className="h-[44px] w-full font-bold text-[14px]"
              isLoading={updateGroupMutation.isPending || isUploading}
            >
              저장
            </Button>
          </div>
        </div>

        {/* 그룹 코드 */}
        <div className="hidden flex flex-1 flex-col gap-1 md:flex">
          <label htmlFor="groupCode" className="mb-1 text-sm font-bold text-gray-900">
            그룹 코드
          </label>
          <div className="relative flex-1">
            <FormInput
              id="groupCode"
              value={groupData?.inviteCode || ''}
              readOnly
              className="w-full cursor-default border-gray-100 bg-gray-50 pr-20 text-gray-900 focus:border-gray-100 focus:ring-0"
              error={codeError}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {/* 새로고침(재발급) 버튼 */}
              <button
                type="button"
                onClick={handleRegenerateCode}
                disabled={regenerateCodeMutation.isPending}
                aria-label="그룹 코드 재발급"
                className="flex h-8 w-8 items-center justify-center rounded-md text-primary-600 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-5 w-5 ${regenerateCodeMutation.isPending ? 'animate-spin' : ''}`}
                />
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                aria-label="그룹 코드 복사"
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
              >
                <CopyIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <MemberUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSaveError(null);
        }}
        onConfirm={handleConfirmSave}
        isSaving={updateGroupMutation.isPending || isUploading}
        errorMessage={saveError}
      />
      <div className="mt-5 w-full border-b border-gray-100 md:hidden" />

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-gray-900/60 md:hidden">
          <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)} />
          <div
            ref={bottomSheetRef}
            className="relative w-full rounded-t-[12px] bg-white px-4 pb-[21px] pt-3"
          >
            <div className="mx-auto mb-6 h-[4px] w-[68px] rounded-full bg-gray-200" />
            {/* 버튼 리스트 */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex items-center gap-4 border-b border-gray-100 py-4 text-[16px] text-gray-900 transition-colors hover:bg-gray-100 active:bg-gray-200"
              >
                <UploadIcon className="h-6 w-6" />
                사진 업로드
              </button>

              <button
                type="button"
                onClick={handleImageDelete}
                className="flex items-center gap-4 py-4 text-[16px] text-red-700 transition-colors hover:bg-red-100 active:bg-red-300"
              >
                <TrashIcon className="h-6 w-6 text-red-700" />
                사진 삭제
              </button>
            </div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 w-full !h-[44px] !rounded-xl !text-[14px] !font-bold !text-gray-700"
            >
              취소
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
