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

export const DashboardPage = () => {
    const { 
        summaryData, 
        displayChores, 
        displayActivities, 
        displayExpenses, 
        displayItems 
    } = useDashboardData();

    return (
        <div className='flex flex-col pt-7'>
            <DashboardSummary data={summaryData} />

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
                        <TodayChoresPanel chores={displayChores} />
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
                        <RecentActivityPanel activities={displayActivities} />
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
                        <UnpaidExpensesPanel expenses={displayExpenses} />
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
                        <ShortageItemsPanel items={displayItems}/>
                    </div>
                </div>
            </div>
        </div>
    );
};