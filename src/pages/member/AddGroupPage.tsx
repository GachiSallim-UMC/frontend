import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AddGroupDto } from '@/features/member';
import { AddGroupActions, AddGroupInput, InvitationCodeBox, GroupSelectHeader } from '@/features/member'

export const AddGroupPage = () => {
    const navigate = useNavigate();

    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [inviteCode, setInviteCode] = useState<string>('');
    const [formData, setFormData] = useState<AddGroupDto>({
        name: '',
        description: '',
        type: 'roommate', 
        maxMemberCount: 1, 
    });

    const handleFormChange = (field: keyof AddGroupDto, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateGroup = () => {
        // 필수값 검증 등 로직 추가 가능
        if (!formData.name.trim()) {
        alert('그룹 이름을 입력해주세요.');
        return;
        }

        setInviteCode('ABCDEF');
        setIsCreated(true);
    };

    const handleEnterDashboard = () => {
        navigate('/dashboard');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleCopyCode = () => {
        if (!inviteCode) return;
        navigator.clipboard.writeText('ABCDEF');
        alert('초대 코드가 복사되었습니다.');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            <div className="flex h-[696px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
                <GroupSelectHeader />
                <div className='px-10 py-7'>
                    <h2 className="mb-5 text-2xl font-bold text-gray-900">
                        새 그룹 만들기
                    </h2>

                    <AddGroupInput
                        formData={formData}
                        onChange={handleFormChange}
                        disabled={isCreated} // 생성 완료 후 폼 입력 비활성화 처리 (선택)
                    />

                    <InvitationCodeBox
                        isCreated={isCreated}
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

