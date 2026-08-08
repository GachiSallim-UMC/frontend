import { useState, useEffect } from 'react';
import { CheckboxGroup, Switch } from '@/shared/components';
import { useAlertStore } from '@/shared/store';
import { NOTIFICATION_LEFT_OPTIONS, NOTIFICATION_RIGHT_OPTIONS, NOTIFICATION_OPTIONS } from '@/features/mypage/types/mypage.constants';
import type { NotificationPreferencesDto, NotificationType } from '@/features/mypage/types/mypage.types';
import { myPageApi } from '@/features/mypage/api/myPage.api';

// 백엔드 객체 -> 프론트엔드 배열 변환
const mapApiToState = (data: NotificationPreferencesDto): NotificationType[] => {
    if (!data) return [];

    const selected: NotificationType[] = [];
    if (data.choreDue) selected.push('CHORE_DEADLINE');
    if (data.supplyStatusChanged) selected.push('SHARED_ITEM_CHANGE');
    if (data.newMessage) selected.push('MESSENGER_MESSAGE');
    if (data.expenseRequest) selected.push('SETTLEMENT_REQUEST');
    if (data.ruleAgreementRequest) selected.push('RULE_AGREEMENT_REQUEST');
    if (data.groupActivity) selected.push('GROUP_ACTIVITY_ALL');
    return selected;
};

// 프론트엔드 배열 -> 백엔드 객체 변환
const mapStateToApi = (selected: NotificationType[]): NotificationPreferencesDto => {
  return {
    choreDue: selected.includes('CHORE_DEADLINE'),
    supplyStatusChanged: selected.includes('SHARED_ITEM_CHANGE'),
    newMessage: selected.includes('MESSENGER_MESSAGE'),
    expenseRequest: selected.includes('SETTLEMENT_REQUEST'),
    ruleAgreementRequest: selected.includes('RULE_AGREEMENT_REQUEST'),
    groupActivity: selected.includes('GROUP_ACTIVITY_ALL'),
  };
};

export const NotificationSettings = () => {
  const showAlert = useAlertStore((state) => state.showAlert);
  
  const [selectedAlerts, setSelectedAlerts] = useState<NotificationType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // 설정 불러오기
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const preferencesData = await myPageApi.getNotificationPreferences();
        setSelectedAlerts(mapApiToState(preferencesData));
      } catch (error) {
        console.error('알림 설정 조회 실패 상세:', error);
        showAlert({
            title: '불러오기 실패',
            message: '알림 설정을 불러오는데 실패했습니다.'
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchPreferences();
  }, [showAlert]);

  // 체크박스 변경 시 서버에 저장
  const handleAlertChange = async (newSelectedAlerts: NotificationType[]) => {
    const previousAlerts = selectedAlerts; 
    setSelectedAlerts(newSelectedAlerts); // Optimistic Update

    try {
      const payload = mapStateToApi(newSelectedAlerts);
    
      await myPageApi.updateNotificationPreferences(payload);
    } catch (error) {
      console.error('알림 설정 업데이트 실패:', error);
      setSelectedAlerts(previousAlerts); // 롤백
      showAlert({
          title: '저장 실패',
          message: '알림 설정을 변경하는데 실패했습니다.'
      });
    }
  };

  if (isFetching) {
    return <div className="p-7 text-gray-500">알림 설정을 불러오는 중입니다...</div>;
  }

  const toggleAlert = (type: NotificationType) => {
    const next = selectedAlerts.includes(type)
      ? selectedAlerts.filter(alert => alert !== type)
      : [...selectedAlerts, type];
    handleAlertChange(next);
  };

    return (
        <section className='flex w-full flex-col lg:rounded-2xl lg:bg-white lg:p-7'>
            <h3 className='mb-2 text-mobile-label font-bold text-gray-700 lg:mb-5 lg:text-lg lg:text-gray-900 lg:leading-snug'>
                알림 설정
            </h3>

            {/* 모바일: 스위치 목록 */}
            <div className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white lg:hidden">
                {NOTIFICATION_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-mobile-label font-bold text-gray-700">{option.label}</span>
                        <Switch
                            checked={selectedAlerts.includes(option.value)}
                            onChange={() => toggleAlert(option.value)}
                        />
                    </div>
                ))}
            </div>

            {/* 데스크톱: 체크박스 2열 */}
            <div className='hidden grid-cols-2 gap-x-46 lg:grid'>
                {/* 좌측 체크박스 그룹 */}
                <CheckboxGroup
                    direction="col"
                    options={NOTIFICATION_LEFT_OPTIONS}
                    value={selectedAlerts}
                    onChange={handleAlertChange}
                />

                {/* 우측 체크박스 그룹 */}
                <CheckboxGroup
                    direction="col"
                    options={NOTIFICATION_RIGHT_OPTIONS}
                    value={selectedAlerts}
                    onChange={handleAlertChange}
                />
            </div>
        </section>
    );
};