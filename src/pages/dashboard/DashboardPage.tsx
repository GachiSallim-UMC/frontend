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
import { GroupSwitchDropdown } from '@/features/member';
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
            {/* 그룹 전환 드롭다운: 모바일 전용 (Figma 06 · 대시보드) */}
            <div className="mb-3 lg:hidden">
                <GroupSwitchDropdown />
            </div>

            <DashboardSummary
                summary={data.summary}
                lowSupplies={data.lowSupplies}
            />

            <div className="mt-4 grid grid-cols-1 gap-5 items-start lg:mt-7 lg:grid-cols-2">
                <div className="flex flex-col">
                    <div className="mb-2 flex items-center justify-between lg:mb-3">
                        <h2 className="text-button font-bold text-gray-800 lg:text-lg">오늘의 집안일</h2>
                        <Link to="/chores"
                            className="flex items-center gap-1 text-mobile-label text-gray-600 transition-colors hover:text-gray-900 lg:text-caption">
                            전체 보기
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div>
                        <TodayChoresPanel chores={data.todayChores} />
                    </div>
                </div>

                <div className="mb-4 flex flex-col lg:mb-0">
                    <div className="mb-2 flex items-center justify-between lg:mb-3">
                        <h2 className="text-button font-bold text-gray-800 lg:text-lg">최근 활동</h2>
                        <Link to="/activity"
                            className="flex items-center gap-1 text-mobile-label text-gray-600 transition-colors hover:text-gray-900 lg:text-caption">
                            전체 보기
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div>
                        <RecentActivityPanel activities={data.recentActivities} />
                    </div>
                </div>
            </div>

            {/* 미정산 항목 · 부족한 공용 물품 상세 목록: 데스크톱 전용 (모바일은 상단 요약 카드로 대체) */}
            <div className="mt-7 hidden grid-cols-2 gap-5 items-start lg:grid">
                <div className="flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800">미정산 항목</h2>
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
                        <h2 className="text-lg font-bold text-gray-800">부족한 공용 물품</h2>
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
