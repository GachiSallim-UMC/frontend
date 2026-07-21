import { useState } from 'react';
import { CheckboxGroup } from '@/shared/components';
import { NOTIFICATION_LEFT_OPTIONS, NOTIFICATION_RIGHT_OPTIONS } from '@/features/mypage/types/mypage.constants';
import type { NotificationType } from '@/features/mypage/types/mypage.types';

export const NotificationSettings = () => {
  const [selectedAlerts, setSelectedAlerts] = useState<NotificationType[]>([
    'CHORE_DEADLINE', 'SHARED_ITEM_CHANGE', 'MESSENGER_MESSAGE',
    'SETTLEMENT_REQUEST', 'RULE_AGREEMENT_REQUEST', 'GROUP_ACTIVITY_ALL',
  ]);

    return (
        <section className='flex w-full flex-col rounded-2xl bg-white p-7'>
            <h3 className='mb-5 text-lg font-bold text-gray-900 leading-snug'>
                알림 설정
            </h3>

            <div className='grid grid-cols-2 gap-x-46'>
                {/* 좌측 체크박스 그룹 */}
                <CheckboxGroup
                    direction="col"
                    options={NOTIFICATION_LEFT_OPTIONS}
                    value={selectedAlerts}
                    onChange={setSelectedAlerts}
                />

                {/* 우측 체크박스 그룹 */}
                <CheckboxGroup
                    direction="col"
                    options={NOTIFICATION_RIGHT_OPTIONS}
                    value={selectedAlerts}
                    onChange={setSelectedAlerts}
                />
            </div>
        </section>
    );
};