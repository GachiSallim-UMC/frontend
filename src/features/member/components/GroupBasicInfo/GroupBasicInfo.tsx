import { useState, useEffect, useRef } from 'react';
import { Button, FormInput, SelectDropdown } from '@/shared/components';
import { formatDate, useDateFormat } from '@/shared/lib';
import { RefreshCw } from 'lucide-react';
import { MemberUpdateModal } from '../MemberUpdateModal';
import { useGroupBasicInfoForm } from '../../hooks/useGroupBasicInfoForm';

import CameraIcon from '@/assets/icons/member/camera.svg?react';
import UploadIcon from '@/assets/icons/member/upload.svg?react';
import TrashIcon from '@/assets/icons/member/trash.svg?react';
import CopyIcon from '@/assets/icons/member/copy.svg?react';

import RoommateIcon from '@/assets/icons/member/ResidenceType/roommate.svg?react';
import ShareIcon from '@/assets/icons/member/ResidenceType/share.svg?react';
import FamilyIcon from '@/assets/icons/member/ResidenceType/family.svg?react';
import BoardingIcon from '@/assets/icons/member/ResidenceType/boarding.svg?react';
import EtcIcon from '@/assets/icons/member/ResidenceType/etc.svg?react';

interface GroupBasicInfoProps {
  isAdmin?: boolean;
  onUnauthorized?: () => void;
}

const MAX_MEMBER_OPTIONS = Array.from({ length: 11 }, (_, index) => {
  const count = index + 2;
  return { value: String(count), label: `${count}명` };
});

export const GroupBasicInfo = ({ isAdmin = false, onUnauthorized }: GroupBasicInfoProps) => {
  const dateFormat = useDateFormat();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
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
    isRegeneratingCode,
    isSaving,
  } = useGroupBasicInfoForm({ isAdmin, onUnauthorized });

  const handleUploadClick = () => {
    setIsMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleImageDelete = () => {
    setIsMenuOpen(false);
    clearGroupImage();
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  if (isGroupLoading) {
    return (
      <section className="flex min-h-48 w-full items-center justify-center rounded-2xl bg-white p-8">
        <span className="text-sm text-gray-500">그룹 정보를 불러오는 중...</span>
      </section>
    );
  }

  if (isGroupError || !groupData) {
    return (
      <section className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl bg-white p-8 text-center">
        <span className="text-sm text-red-700">그룹 정보를 불러오지 못했습니다.</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          isLoading={isGroupFetching}
          onClick={() => void refetchGroup()}
        >
          다시 시도
        </Button>
      </section>
    );
  }

  return (
    <section
      className="mx-auto flex w-full max-w-[390px] flex-col items-center bg-transparent
    lg:max-w-none lg:flex-row lg:items-start lg:gap-23 lg:rounded-2xl lg:bg-white lg:p-7"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      {/* 좌측: 프로필 */}
      <div className="lg:mx-20 flex shrink-0 flex-col items-center justify-center lg:pt-2">
        <div className="relative mb-[10px] h-[100px] w-[100px] lg:mb-4 lg:h-[156px] lg:w-[156px]">
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
          {isAdmin && (
            <div ref={menuRef} className="absolute bottom-0 right-0">
              <button
                aria-label="프로필 이미지 변경"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-[30px] w-[30px] lg:h-[40px] lg:w-[40px] items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100"
              >
                <CameraIcon className="h-[18px] w-[18px] lg:h-[24px] lg:w-[24px] text-gray-700" />
              </button>

              {/* 팝업 드롭다운 창 -> 데스크탑 전용*/}
              {isMenuOpen && (
                <div className="absolute left-12 top-0 z-20 lg:flex hidden w-[180px] flex-col rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900 ring-dropdown">
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
          )}
        </div>
        <span className="text-[16px] lg:text-[20px] font-bold text-gray-900">
          {groupData?.name || ''}
        </span>
        <span className="text-[10px] lg:text-[14px] text-gray-400">생성일: {formattedDate}</span>

        {/* 모바일 전용 -> 데스크탑에서는 숨김*/}
        <div className="mt-[3px] flex items-center justify-center gap-1.5 lg:hidden">
          <span className="text-[12px] font-bold uppercase tracking-widest text-primary-700">
            {groupData?.inviteCode || ''}
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={handleRegenerateCode}
              disabled={isRegeneratingCode}
              aria-label="그룹 코드 재발급"
              className="flex items-center justify-center text-primary-700 transition-colors hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-[12px] w-[12px] ${isRegeneratingCode ? 'animate-spin' : ''}`}
              />
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleCopyCode()}
            disabled={!groupData.inviteCode}
            aria-label="그룹 코드 복사"
            className="flex items-center justify-center text-primary-700 transition-colors hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CopyIcon className="h-[12px] w-[12px]" />
          </button>
        </div>
      </div>

      {/* 우측: 그룹 기본 정보 */}
      <div className="flex w-full flex-1 flex-col mt-[15px] lg:mt-0">
        <h3 className="mb-5 hidden text-lg font-bold text-gray-900 leading-snug lg:block">
          그룹 기본 정보
        </h3>

        {/* 그룹 이름 & 최대 인원 */}
        <div className="flex w-full flex-col gap-[10px] lg:mb-5 lg:grid lg:grid-cols-2">
          <div className="order-1 flex h-full flex-col justify-end lg:order-1">
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
              disabled={!isAdmin}
              className="h-[44px] lg:h-[50px] text-[12px] lg:text-[16px]"
            />
          </div>

          {/* 그룹 소개 & 저장 */}
          <div className="order-2 lg:order-3 flex flex-col lg:col-span-2 lg:flex-row lg:items-end lg:gap-5">
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
                disabled={!isAdmin}
                className="h-[44px] lg:h-[50px] text-[12px] lg:text-[16px]"
              />
            </div>

            <Button
              onClick={handleSave}
              variant="primary"
              className="hidden lg:flex w-32 shrink-0 font-bold h-[50px]"
              isLoading={isSaving}
              disabled={!isAdmin}
            >
              저장
            </Button>
          </div>

          <div className="order-3 flex h-full flex-col justify-end lg:order-2">
            <SelectDropdown
              id="maxMembers"
              label="최대 인원"
              value={maxMemberCount}
              onChange={value => {
                setMaxMemberCount(value);
                setErrors(previous => ({ ...previous, maxMemberCount: undefined }));
              }}
              options={MAX_MEMBER_OPTIONS}
              placeholder="인원 선택"
              error={errors.maxMemberCount}
              disabled={!isAdmin}
              className="h-[44px] lg:h-[50px] text-[12px] lg:text-[16px]"
            />
          </div>
          <div className="order-4 mt-[10px] lg:hidden">
            <Button
              onClick={handleSave}
              variant="primary"
              className="h-[44px] w-full font-bold text-[14px]"
              isLoading={isSaving}
              disabled={!isAdmin}
            >
              저장
            </Button>
          </div>
        </div>

        {/* 그룹 코드 */}
        <div className="hidden flex flex-1 flex-col gap-1 lg:flex">
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
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  disabled={isRegeneratingCode}
                  aria-label="그룹 코드 재발급"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-primary-600 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 ${isRegeneratingCode ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button
                type="button"
                onClick={() => void handleCopyCode()}
                disabled={!groupData.inviteCode}
                aria-label="그룹 코드 복사"
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
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
        isSaving={isSaving}
        errorMessage={saveError}
      />
      <div className="mt-5 w-full border-b border-gray-100 lg:hidden" />

      {isAdmin && isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-gray-900/60 lg:hidden">
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
