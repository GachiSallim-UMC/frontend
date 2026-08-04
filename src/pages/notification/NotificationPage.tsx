import { Button, LabelFilterDropdown } from '@/shared/components/ui';
import { NotificationList, useNotifications } from '@/features/notification';

export const NotificationPage = () => {
  const {
    isLoading,
    isError,
    refetch,
    statusFilter,
    setStatusFilter,
    statusOptions,
    categoryFilter,
    setCategoryFilter,
    categoryOptions,
    filteredNotifications,
    markAsRead,
    markAllAsRead,
    hideNotification,
  } = useNotifications();

  return (
    <div className="flex w-full flex-1 min-h-0 bg-gray-50">
      <div className="flex flex-col w-full h-full pb-[28px] gap-[28px]">

        <div className="w-full flex-1 min-h-0 bg-white rounded-[20px] flex flex-col py-4 overflow-hidden lg:max-h-[720px] lg:py-[30px]">
          <div className="flex flex-wrap justify-between items-center w-full px-4 mb-[14px] lg:px-[30px]">
            <div className="flex flex-wrap gap-4 z-20">
              <LabelFilterDropdown
                value={statusFilter}
                options={statusOptions}
                onChange={setStatusFilter}
              />
              <LabelFilterDropdown
                value={categoryFilter}
                options={categoryOptions}
                onChange={setCategoryFilter}
              />
            </div>

            <Button
              variant="secondary"
              onClick={() => markAllAsRead()}
              className="pt-[16px] pr-[31px] pb-[15px] pl-[30px] h-auto rounded-lg text-[16px] font-normal text-gray-600 leading-normal border-gray-100 hover:bg-gray-100 active:bg-gray-200"
            >
              전체 읽음 처리
            </Button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col items-start w-full px-4 overflow-y-auto lg:px-[30px]">
            {isLoading ? (
              <div className="flex w-full flex-1 items-center justify-center">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                <span className="ml-3 text-sm text-gray-600">알림을 불러오는 중입니다</span>
              </div>
            ) : isError ? (
              <div className="flex w-full flex-1 flex-col items-center justify-center gap-3">
                <p className="text-sm font-medium text-red-700">알림을 불러오지 못했습니다.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                  다시 시도
                </Button>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <NotificationList
                notifications={filteredNotifications}
                onHide={hideNotification}
                onMarkAsRead={markAsRead}
              />
            ) : (
              <div className="flex w-full flex-1 items-center justify-center">
                <p className="text-sm text-gray-600">알림이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
