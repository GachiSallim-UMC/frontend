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
        <div className="grid grid-cols-4 gap-6 ">
            <SummaryCard
                icon={<HomeIcon className="h-12 w-12" />}
                iconBg="bg-primary-200"
                label="오늘 집안일"
                value={`${summary.todayChoreCount}건`}
                subText={
                    <span>
                        미완료 <span className="text-primary-500">{summary.unfinishedChoreCount}</span> / 완료 {doneChoresCount}
                    </span>
                }
            />
            <SummaryCard
                icon={<WalletIcon className="h-12 w-12" />}
                iconBg="bg-orange-100"
                label="미정산 금액"
                value={`${summary.unsettledAmount.toLocaleString()}원`}
                subText={
                    <span>
                        <span className="text-primary-500">{summary.unsettledExpenseCount}건</span> 미정산
                    </span>
                }
            />
            <SummaryCard
                icon={<BottleIcon className="h-12 w-12" />}
                iconBg="bg-green-100"
                label="부족한 공용 물품"
                value={`${summary.lowSupplyCount}종`}
                subText={summary.lowSupplyCount > 0 ? supplyNames : "부족한 물품이 없습니다"}
            />
            <SummaryCard
                icon={<ChatBubbleIcon className="h-12 w-12" />}
                iconBg="bg-red-100"
                label="안 읽은 메시지"
                value={`${summary.unreadMessageCount}건`}
                subText={
                    <span className="flex items-center gap-1 cursor-pointer">
                        채팅창 바로가기
                        <ArrowRight className="h-4 w-4 text-primary-500" strokeWidth={2.5} />
                    </span>
                }
                onClick={() => navigate('/messenger')}
            />
        </div>
    );
};
