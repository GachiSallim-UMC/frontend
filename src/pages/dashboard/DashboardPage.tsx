import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DashboardSummary, 
  TodayChoresPanel, 
  RecentActivityPanel, 
  UnpaidExpensesPanel, 
  ShortageItemsPanel,
  useDashboardData
} from '@/features/dashboard';
import { useGroupStore } from '@/shared/store';

export const DashboardPage = () => {
    const selectedGroupId = useGroupStore(state => state.selectedGroupId);
    const groupId = selectedGroupId ? Number(selectedGroupId) : 0; 
    const { data, isLoading, isError } = useDashboardData(groupId);

    if (!selectedGroupId) {
        return <div className="p-7 text-center text-gray-500">조회할 그룹을 선택해주세요.</div>;
    }

    if (isLoading) {
        return <div className="p-7 text-center text-gray-500">대시보드 데이터를 불러오는 중입니다...</div>;
    }

    if (isError || !data) {
        return <div className="p-7 text-center text-red-500">데이터를 불러오지 못했습니다.</div>;
    }

    return (
        <div className='flex flex-col'>
            <DashboardSummary 
                summary={data.summary} 
                lowSupplies={data.lowSupplies} 
            />

            <div className="mt-7 grid grid-cols-2 gap-5 items-start">
                <div className="flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-800">오늘의 집안일</h1>
                        <Link to="/chores" 
                            className="flex items-center gap-1 text-caption text-gray-600 transition-colors hover:text-gray-900">
                            전체 보기
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div>
                        <TodayChoresPanel chores={data.todayChores} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-800">최근 활동</h1>
                        <Link to="/activity" 
                            className="flex items-center gap-1 text-caption text-gray-600 transition-colors hover:text-gray-900">
                            전체 보기
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div>
                        <RecentActivityPanel activities={data.recentActivities} />
                    </div>
                </div>
            </div>

             <div className="mt-7 grid grid-cols-2 gap-5 items-start">
                <div className="flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-800">미정산 항목</h1>
                        <Link to="/expenses" 
                            className="flex items-center gap-1 text-caption text-gray-600 transition-colors hover:text-gray-900">
                            전체 보기
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div>
                        <UnpaidExpensesPanel expenses={data.unsettledExpenses} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-800">부족한 공용 물품</h1>
                        <Link to="/items" 
                            className="flex items-center gap-1 text-caption text-gray-600 transition-colors hover:text-gray-900">
                            전체 보기
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div>
                        <ShortageItemsPanel items={data.lowSupplies}/>
                    </div>
                </div>
            </div>
        </div>
    );
};