import { Panel, StatusBadge } from "@/shared/components";

import BasketIcon from "@/assets/icons/dashboard/unPaid/basket.svg?react"
import BookIcon from "@/assets/icons/dashboard/unPaid/book.svg?react"
import CalculatorIcon from "@/assets/icons/dashboard/unPaid/calculator.svg?react"
import CarIcon from "@/assets/icons/dashboard/unPaid/car.svg?react"
import CoffeeIcon from "@/assets/icons/dashboard/unPaid/coffee.svg?react"
import EtcIcon from "@/assets/icons/dashboard/unPaid/etc.svg?react"
import GameIcon from "@/assets/icons/dashboard/unPaid/game.svg?react"
import HouseIcon from "@/assets/icons/dashboard/unPaid/house.svg?react"
import ShoppingIcon from "@/assets/icons/dashboard/unPaid/shopping.svg?react"
import SpoonIcon from "@/assets/icons/dashboard/unPaid/spoon.svg?react"

export interface MemberShare {
  amount: number;
  isPaid: boolean;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  status: 'unpaid' | 'paid' | string;
  payer: { name: string };
  shares: MemberShare[];
  category: string;
}

const getExpenseIcon = (category: string) => {
    switch (category) {
        case 'grocery':
            return <BasketIcon className="h-7 w-7" />;
        case 'education':
            return <BookIcon className="h-7 w-7" />;
        case 'finance':
            return <CalculatorIcon className="h-7 w-7" />;
        case 'transport':
            return <CarIcon className="h-7 w-7" />;
        case 'cafe':
            return <CoffeeIcon className="h-7 w-7" />;
        case 'leisure':
            return <GameIcon className="h-7 w-7" />;
        case 'living':
            return <HouseIcon className="h-7 w-7" />;
        case 'shopping':
            return <ShoppingIcon className="h-7 w-7" />;
        case 'food':
            return <SpoonIcon className="h-7 w-7" />;
        default:
            return <EtcIcon className="h-7 w-7" />;
    }
}

export const UnpaidExpensesPanel = ({expenses}: { expenses: Expense[] }) => {
    return (
        <Panel>
            <ul className="flex flex-col gap-5">
                {expenses.map((expense) => {
                    const perPerson = Math.floor(expense.amount / expense.shares.length);
                    return (
                        <li key={expense.id} className="flex items-center justify-between border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100">
                                    {getExpenseIcon(expense.category)}
                                </div>

                                <div>
                                    <p className="font-bold text-gray-900">{expense.title}</p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {expense.payer.name} {expense.status === 'unpaid' ? '미수' : '선지불'} | 1인당 {perPerson.toLocaleString()}원
                                    </p>
                                </div>
                            </div>
                            <StatusBadge variant={expense.status === 'paid' ? 'done' : 'unpaid'} />
                        </li>
                    );
                })}
            </ul>
        </Panel>
    );
};