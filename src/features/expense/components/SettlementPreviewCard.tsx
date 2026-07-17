import TossIcon from '@/assets/icons/expense/toss.svg?react';
import { CustomButton, IconTextButton } from '@/features/expense';
import type { Expense } from '@/features/expense/types/expense.types';


interface SettlementPreviewCardProps {
  expense: Expense;
  onTossClick?: () => void;
  onSettleClick?: () => void;
}

export const SettlementPreviewCard = ({
  expense,
  onTossClick,
  onSettleClick,
}: SettlementPreviewCardProps) => {
  const memberCount = expense.shares.length;

  return (
    <div className='w-full bg-white p-[24px] rounded-[18px] flex flex-col gap-5 border border-primary-600'>
      <h2 className='font-sans text-body font-bold text-gray-800'>정산 상세 미리보기</h2>

      <div className='flex flex-col gap-3'>
        <span className='text-button font-bold text-gray-800'>구매내역</span>
        
        <div className='flex flex-col gap-2 text-button text-gray-900'>
          <div className='flex justify-between items-center'>
            <span>{expense.title}</span>
            <span className='text-gray-900'>
              {expense.amount.toLocaleString()} / {memberCount} = {Math.floor(expense.amount / memberCount).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <div className='border-b border-dashed border-gray-900 my-1' />

      <div className='flex justify-between items-center font-bold text-button'>
        <span className='text-gray-800'>1인당 부담 금액</span>
        <span className='text-primary-700 text-lg'>
          {(expense.shares[0]?.amount ?? 0).toLocaleString()}원
        </span>
      </div>

      <div className='flex items-center gap-3 mt-2'>
        <IconTextButton
          label="토스로 송금"
          variant="toss"
          iconComponent={TossIcon}
          onClick={onTossClick}
          className="flex-1"
        />

        <CustomButton
          label="정산하기"
          variant="primary"
          onClick={onSettleClick}
          className="flex-1 h-[50px] rounded-[8px]"
        />
      </div>
    </div>
  );
};

export default SettlementPreviewCard;