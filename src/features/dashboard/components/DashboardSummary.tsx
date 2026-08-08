import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SummaryCard } from "@/shared/components";
import type { DashboardSummaryDto as DashboardSummaryType, DashboardSupplyDto } from "@/features/dashboard/types/dashboard.types"

import HomeIcon from "@/assets/icons/dashboard/home.svg?react";
import WalletIcon from "@/assets/icons/dashboard/wallet.svg?react";
import BottleIcon from "@/assets/icons/dashboard/bottle.svg?react"
import ChatBubbleIcon from "@/assets/icons/dashboard/chat.svg?react"

interface DashboardSummaryProps {
    summary: DashboardSummaryType;
    lowSupplies: DashboardSupplyDto[];
}

export const DashboardSummary = ({ summary, lowSupplies }: DashboardSummaryProps) => {
    const navigate = useNavigate();

    // 완료된 집안일 계산: 전체 - 미완료
    const doneChoresCount = summary.todayChoreCount - summary.unfinishedChoreCount;
    const supplyNames = lowSupplies.map(item => item.name).join(", ");

    return (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-6">
            <SummaryCard
                icon={<HomeIcon className="h-8 w-8 lg:h-12 lg:w-12" />}
                iconBg="bg-primary-200"
                iconClassName="h-14 w-14 lg:h-20 lg:w-20"
                className="items-center gap-2 rounded-lg px-4 py-4 lg:gap-4 lg:rounded-[18px] lg:px-6 lg:py-7"
                label="오늘 집안일"
                labelClassName="text-mobile-caption lg:text-caption"
                value={`${summary.todayChoreCount}건`}
                valueClassName="text-[16px] lg:text-key-number"
                subText={
                    <span>
                        미완료 <span className="text-primary-500">{summary.unfinishedChoreCount}</span> / 완료 {doneChoresCount}
                    </span>
                }
                subTextClassName="mt-2 text-mobile-caption lg:mt-6 lg:text-caption"
                onClick={() => navigate('/chores')}
            />
            <SummaryCard
                icon={<WalletIcon className="h-8 w-8 lg:h-12 lg:w-12" />}
                iconBg="bg-orange-100"
                iconClassName="h-14 w-14 lg:h-20 lg:w-20"
                className="items-center gap-2 rounded-lg px-4 py-4 lg:gap-4 lg:rounded-[18px] lg:px-6 lg:py-7"
                label="미정산 금액"
                labelClassName="text-mobile-caption lg:text-caption"
                value={`${summary.unsettledAmount.toLocaleString()}원`}
                valueClassName="text-[16px] lg:text-key-number"
                subText={
                    <span>
                        <span className="text-primary-500">{summary.unsettledExpenseCount}건</span> 미정산
                    </span>
                }
                subTextClassName="mt-2 text-mobile-caption lg:mt-6 lg:text-caption"
                onClick={() => navigate('/expenses')}
            />
            <SummaryCard
                icon={<BottleIcon className="h-8 w-8 lg:h-12 lg:w-12" />}
                iconBg="bg-green-100"
                iconClassName="h-14 w-14 lg:h-20 lg:w-20"
                className="items-center gap-2 rounded-lg px-4 py-4 lg:gap-4 lg:rounded-[18px] lg:px-6 lg:py-7"
                label="부족한 공용 물품"
                labelClassName="text-mobile-caption lg:text-caption"
                value={`${summary.lowSupplyCount}종`}
                valueClassName="text-[16px] lg:text-key-number"
                subText={summary.lowSupplyCount > 0 ? supplyNames : "부족한 물품이 없습니다"}
                subTextClassName="mt-2 truncate text-mobile-caption lg:mt-6 lg:whitespace-normal lg:text-caption"
                onClick={() => navigate('/items')}
            />
            <SummaryCard
                icon={<ChatBubbleIcon className="h-8 w-8 lg:h-12 lg:w-12" />}
                iconBg="bg-red-100"
                iconClassName="h-14 w-14 lg:h-20 lg:w-20"
                className="items-center gap-2 rounded-lg px-4 py-4 lg:gap-4 lg:rounded-[18px] lg:px-6 lg:py-7"
                label="안 읽은 메시지"
                labelClassName="text-mobile-caption lg:text-caption"
                value={`${summary.unreadMessageCount}건`}
                valueClassName="text-[16px] lg:text-key-number"
                subText={
                    <span className="flex items-center gap-1">
                        채팅방 바로가기
                        <ArrowRight className="h-3 w-3 text-primary-500 lg:h-4 lg:w-4" strokeWidth={2.5} />
                    </span>
                }
                subTextClassName="mt-2 text-mobile-caption lg:mt-6 lg:text-caption"
                onClick={() => navigate('/messenger')}
            />
        </div>
    );
};
