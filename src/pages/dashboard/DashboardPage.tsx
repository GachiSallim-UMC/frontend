import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DashboardSummary, 
  TodayChoresPanel, 
  RecentActivityPanel, 
  UnpaidExpensesPanel, 
  ShortageItemsPanel 
} from '@/features/dashboard';
import { chores, expenses, items, activities, chatRooms } from '@/pages/_shared/mockData';

export const DashboardPage = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${date}`;

    const todayChores = chores.filter((c) => {
        if (c.repeatType === 'daily') return true;
        
        if (!c.startDate) return false; 
        
        const endDate = c.endDate || c.startDate; 
        
        return todayString >= c.startDate && todayString <= endDate;
    });
    const pendingChores = todayChores.filter((c) => c.status !== 'done').length;
    const doneChores = todayChores.filter((c) => c.status === 'done').length;
    const unpaidExps = expenses.filter((e) => e.status === 'unpaid');
    const shortItems = items.filter((i) => i.status === 'short' || i.status === 'empty');

    const summaryData = {
        chores: {total: pendingChores + doneChores, pending: pendingChores, done: doneChores },
        expenses: {
            totalAmount: unpaidExps.reduce((acc, curr) => acc + curr.amount, 0),
            count: unpaidExps.length
        },
        items: {
            count: shortItems.length,
            names: shortItems.map(i => i.name).join(', ')
        },
        messages: {
            unread: chatRooms.reduce((acc, curr) => acc + curr.unreadCount, 0)
        },
    };

    // 화면에 노출될 개수 제한
    const displayChores = todayChores.slice(0, 3);
    const displayActivities = activities.slice(0, 3);
    const displayExpenses = unpaidExps.slice(0, 3);
    const displayItems = shortItems.slice(0, 3);

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
                        <Link to="/activities" 
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
                        <Link to="/supplies" 
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