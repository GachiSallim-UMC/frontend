import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SummaryCard } from "@/shared/components";

import HomeIcon from "@/assets/icons/dashboard/home.svg?react";
import WalletIcon from "@/assets/icons/dashboard/wallet.svg?react";
import BottleIcon from "@/assets/icons/dashboard/bottle.svg?react"
import ChatBubbleIcon from "@/assets/icons/dashboard/chat.svg?react"

export interface SummaryData {
    chores: {total: number; pending: number; done: number };
    expenses: {totalAmount: number; count: number };
    items: {count: number; names: string };
    messages: {unread: number};
}

export const DashboardSummary = ({data}: {data: SummaryData}) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-4 gap-6 ">
            <SummaryCard
                icon={<HomeIcon className="h-12 w-12" />}
                iconBg="bg-primary-200"
                label="오늘 집안일"
                value={`${data.chores.total}건`}
                subText={
                    <span>
                        미완료 <span className="text-primary-500">{data.chores.pending}</span> / 완료 {data.chores.done}
                    </span>
                }
            />
            <SummaryCard
                icon={<WalletIcon className="h-12 w-12" />}
                iconBg="bg-orange-100"
                label="미정산 금액"
                value={`${data.expenses.totalAmount.toLocaleString()}원`}
                subText={
                    <span>
                        <span className="text-primary-500">{data.expenses.count}건</span> 미정산
                    </span>
                }
                />
            <SummaryCard
                icon={<BottleIcon className="h-12 w-12" />}
                iconBg="bg-green-100"
                label="부족한 공용 물품"
                value={`${data.items.count}종`}
                subText={data.items.names}
            />
            <SummaryCard
                icon={<ChatBubbleIcon className="h-12 w-12" />}
                iconBg="bg-red-100"
                label="안 읽은 메시지"
                value={`${data.messages.unread}건`}
                subText={
                    <span className="flex items-center gap-1">
                        채팅창 바로가기
                        <ArrowRight className="h-4 w-4 text-primary-500" strokeWidth={2.5} />
                    </span>
                }
                onClick={() => navigate('/chat')}
            />
        </div>

    );
};
