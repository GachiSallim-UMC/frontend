import { ActivityFilterDropdown, ActivityList, useActivityLog } from '@/features/activity';
import { activityLogs } from '@/pages/_shared/mockData';

export const ActivityPage = () => {
  const {
    typeFilter,
    setTypeFilter,
    typeOptions,
    memberFilter,
    setMemberFilter,
    memberOptions,
    periodFilter,
    setPeriodFilter,
    periodOptions,
    groupedLogs,
  } = useActivityLog(activityLogs);

  return (
    <div className="flex w-full flex-1 min-h-0 justify-center bg-gray-50">
      <div className="flex h-full w-full flex-col items-center px-4 pb-[28px] pt-[28px] lg:max-w-[1180px]">
        <div className="flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-[20px] bg-white py-4 shadow-card lg:max-h-[720px] lg:max-w-[1114px] lg:py-[30px]">
          <div className="flex flex-wrap shrink-0 items-center gap-3 px-4 lg:px-[30px]">
            <ActivityFilterDropdown value={typeFilter} options={typeOptions} onChange={setTypeFilter} />
            <ActivityFilterDropdown value={memberFilter} options={memberOptions} onChange={setMemberFilter} />
            <ActivityFilterDropdown value={periodFilter} options={periodOptions} onChange={setPeriodFilter} />
          </div>
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-4 lg:px-[30px]">
            <ActivityList groups={groupedLogs} />
          </div>
        </div>
      </div>
    </div>
  );
};
