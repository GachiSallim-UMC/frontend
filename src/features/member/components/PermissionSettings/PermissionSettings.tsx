import { useState } from 'react';
import { CheckboxGroup } from '@/shared/components'; 
import type { PermissionType } from '@/features/member'
import type { CheckboxOption } from '@/shared/components';

const PERMISSION_LEFT_OPTIONS: CheckboxOption<PermissionType>[] = [
  { value: 'ALLOW_CHORE', label: '멤버의 집안일 등록 허용' },
  { value: 'ALLOW_ITEM_STATUS', label: '멤버의 공용 물품 상태 변경 허용' },
];

const PERMISSION_RIGHT_OPTIONS: CheckboxOption<PermissionType>[] = [
  { value: 'ALLOW_SETTLEMENT', label: '멤버의 정산 등록 허용' },
  { value: 'AUTO_APPROVE', label: '신규 멤버 자동 승인 (관리자 승인 생략)' },
];

export const PermissionSettings = () => {
    const [selectedPermissions, setSelectedPermissions] = useState<PermissionType[]>([
        'ALLOW_CHORE',
        'ALLOW_ITEM_STATUS',
    ]);

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
                        onChange={setSelectedPermissions}
                    />
                    </div>

                    {/* 우측 체크박스 그룹 */}
                    <div className="flex-1">
                    <CheckboxGroup
                        direction="col"
                        options={PERMISSION_RIGHT_OPTIONS}
                        value={selectedPermissions}
                        onChange={setSelectedPermissions}
                    />
                </div>
            </div>
        </section>
    )
}