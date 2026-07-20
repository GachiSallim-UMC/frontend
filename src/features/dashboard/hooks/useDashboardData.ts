import { useMemo } from 'react';
import { chores, expenses, items, activities, chatRooms } from '@/pages/_shared/mockData';

export const useDashboardData = () => {
    return useMemo(() => {
        // 오늘 날짜 계산
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${date}`;

        // 데이터 필터링
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

        // 요약 데이터 객체 생성
        const summaryData = {
            chores: { 
                total: pendingChores + doneChores, 
                pending: pendingChores, 
                done: doneChores 
            },
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

        // 화면 노출용 슬라이스 데이터 및 요약 데이터 반환
        return {
            summaryData,
            displayChores: todayChores.slice(0, 3),
            displayActivities: activities.slice(0, 3),
            displayExpenses: unpaidExps.slice(0, 3),
            displayItems: shortItems.slice(0, 3),
        };
    }, []); 
};