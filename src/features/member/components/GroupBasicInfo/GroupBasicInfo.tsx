import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, FormInput, SelectDropdown } from '@/shared/components';
import { memberApi } from '@/features/member/api/member.api';
import { useUpdateGroup } from '../../hooks/useGroupMutations';
import { useGroupStore } from '@/shared/store';
import { authApi } from '@/features/auth';

import CameraIcon from '@/assets/icons/member/camera.svg?react';
import UploadIcon from '@/assets/icons/member/upload.svg?react';
import TrashIcon from '@/assets/icons/member/trash.svg?react';
import ProfileIcon from '@/assets/icons/member/profile.svg?react';
import CopyIcon from '@/assets/icons/member/copy.svg?react';

import RoommateIcon from '@/assets/icons/member/ResidenceType/roommate.svg?react';
import ShareIcon from '@/assets/icons/member/ResidenceType/share.svg?react';
import FamilyIcon from '@/assets/icons/member/ResidenceType/family.svg?react';
import BoardingIcon from '@/assets/icons/member/ResidenceType/boarding.svg?react';
import EtcIcon from '@/assets/icons/member/ResidenceType/etc.svg?react';

export const GroupBasicInfo = () => {
  const selectedGroupId = useGroupStore(s => s.selectedGroupId);
  const updateGroupMutation = useUpdateGroup();

  const [groupName, setGroupName] = useState<string>('');
  const [maxMemberCount, setMaxMemberCount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setIsAvatarDeleted(false);
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
      setIsAvatarDeleted(false);
    }
  };

  const handleDefaultAvatarSelect = () => {
    setIsMenuOpen(false);
    setGroupImage(null);
    setSelectedFile(null);
    setIsAvatarDeleted(false);
  };

  const handleImageDelete = () => {
    setIsMenuOpen(false);
    setGroupImage(null);
    setSelectedFile(null);
    setIsAvatarDeleted(true);
  };

  const handleSave = async () => {
    if (!selectedGroupId) return;

    if (!groupName.trim()) {
      alert('그룹 이름을 입력해주세요.');
      return;
    }

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
            name: groupName,
            description: description,
            maxMembers: Number(maxMemberCount),
            groupImage: finalGroupImageUrl,
          },
        },
        {
          onSuccess: () => {
            alert('그룹 정보가 수정되었습니다.');
            setSelectedFile(null);
            setIsUploading(false);
          },
          onError: () => {
            alert('그룹 정보 수정에 실패했습니다.');
            setIsUploading(false);
          },
        },
      );
    } catch {
      alert('이미지 저장 중 오류가 발생했습니다.');
      setIsUploading(false);
    }
  };

  const handleCopyCode = () => {
    if (!groupData?.inviteCode) return;
    navigator.clipboard.writeText(groupData.inviteCode);
    alert('그룹 코드가 복사되었습니다.');
  };

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formattedDate = groupData?.createdAt
    ? new Date(groupData.createdAt).toLocaleDateString().replace(/\./g, '.').trim()
    : '';

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
    <section className="flex w-full items-start gap-23 rounded-2xl bg-white p-7">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {/* 좌측: 프로필 */}
      <div className="mx-20 flex shrink-0 flex-col items-center justify-center pt-2">
        <div className="relative mb-4 h-36 w-36">
          {groupImage ? (
            <img
              src={groupImage}
              alt="그룹 프로필"
              className="h-full w-full rounded-full object-cover"
            />
          ) : isAvatarDeleted ? (
            <div className="h-full w-full rounded-full bg-primary-200 object-cover" />
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100"
            >
              <CameraIcon className="h-6 w-6 text-gray-700" />
            </button>

            {/* 팝업 드롭다운 창 */}
            {isMenuOpen && (
              <div className="absolute left-12 top-0 z-20 flex w-[180px] flex-col rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900 ring-dropdown">
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  <UploadIcon />
                  사진 업로드
                </button>
                <button
                  onClick={handleDefaultAvatarSelect}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  <ProfileIcon />
                  기본 아바타 선택
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
        <span className="text-xl font-bold text-gray-900">{groupName}</span>
        <span className="text-sm text-gray-600">{formattedDate}</span>
      </div>

      {/* 우측: 그룹 기본 정보 */}
      <div className="flex flex-1 flex-col">
        <h3 className="mb-5 text-lg font-bold text-gray-900 leading-snug">그룹 기본 정보</h3>

        {/* 그룹 이름 & 최대 인원 */}
        <div className="mb-5 grid grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label htmlFor="groupName" className="mb-1 text-sm font-bold text-gray-900">
              그룹 이름
            </label>
            <FormInput
              id="groupName"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="그룹 이름을 입력해주세요"
            />
          </div>
          <SelectDropdown
            id="maxMembers"
            label="최대 인원"
            value={maxMemberCount}
            onChange={setMaxMemberCount}
            options={maxMemberOptions}
            placeholder="인원 선택"
          />
        </div>

        {/* 그룹 소개 & 저장 */}
        <div className="mb-5 flex items-end gap-5">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="description" className="mb-1 text-sm font-bold text-gray-900">
              그룹 소개
            </label>
            <FormInput
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="그룹을 소개하는 한 줄 평을 적어주세요"
            />
          </div>

          <Button
            onClick={handleSave}
            variant="primary"
            className="w-32 shrink-0 font-bold h-[50px]"
            isLoading={updateGroupMutation.isPending || isUploading}
          >
            저장
          </Button>
        </div>

        {/* 그룹 코드 */}
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="groupCode" className="mb-1 text-sm font-bold text-gray-900">
            그룹 코드
          </label>
          <div className="relative flex-1">
            <FormInput
              id="groupCode"
              value={groupData?.inviteCode || ''}
              readOnly
              className="w-full cursor-default border-gray-100 bg-gray-50 pr-12 text-gray-900 focus:border-gray-100 focus:ring-0"
            />
            <button
              type="button"
              onClick={handleCopyCode}
              aria-label="그룹 코드 복사"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
            >
              <CopyIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
