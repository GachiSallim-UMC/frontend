import TossIcon from '@/assets/icons/expense/toss.svg?react';
import { CustomButton, IconTextButton } from '@/features/expense';
import type { Expense } from '@/features/expense';

interface SettlementPreviewCardProps {
  expense?: Expense;
  onTossClick?: () => void;
  onSettleClick?: () => void;
}

export const SettlementPreviewCard = ({
  expense,
  onTossClick,
  onSettleClick,
}: SettlementPreviewCardProps) => {
  if (!expense) {
    return (
      <div className='w-full bg-white p-[24px] rounded-[18px] flex items-center justify-center text-gray-500 border border-gray-100'>
        입력된 내역의 정산 미리보기가 없습니다.
      </div>
    );
  }

  const memberCount = expense.shares.length || 1;
  const isDirectSplit = expense.splitType === 'ratio'; // 'ratio'가 직접 입력에 해당


  const equalPerPerson = Math.floor(expense.amount / memberCount);

  return (
    <div className='w-full bg-white p-[24px] rounded-[18px] flex flex-col gap-5 border border-primary-600'>
      <h2 className='font-sans text-body font-bold text-gray-800'>정산 상세 미리보기</h2>

      <div className='flex flex-col gap-3'>
        <span className='text-button font-bold text-gray-800'>구매내역</span>
        
        <div className='flex flex-col gap-2 text-button text-gray-900'>
          <div className='flex justify-between items-center'>
            <span>{expense.title || '항목명 미입력'}</span>
            {!isDirectSplit ? (
              <span className='text-gray-900'>
                {expense.amount.toLocaleString()} / {memberCount} = {equalPerPerson.toLocaleString()}원
              </span>
            ) : (
              <span className='text-gray-900'>
                {expense.amount.toLocaleString()}원 (직접입력)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='border-b border-dashed border-gray-900 my-1' />

      <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-center font-bold text-button'>
          <span className='text-gray-800'>
            {isDirectInputSummaryLabel(expense)}
          </span>
          <span className='text-primary-700 text-lg'>
            {isDirectSplit 
              ? `${expense.shares.reduce((acc, cur) => Math.max(acc, cur.amount), 0).toLocaleString()}원 등` // 직접 입력일 경우 대표 금액 혹은 안내
              : `${equalPerPerson.toLocaleString()}원`
            }
          </span>
        </div>

        {isDirectSplit && (
          <div className='flex flex-col gap-1 mt-1 bg-gray-50 p-3 rounded-lg'>
            {expense.shares.map((share) => (
              <div key={share.user.id} className='flex justify-between text-caption text-gray-700'>
                <span>{share.user.name}</span>
                <span>{share.amount.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        )}
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


function isDirectInputSummaryLabel(expense: Expense): string {
  return expense.splitType === 'ratio' ? '멤버별 부담 금액' : '1인당 부담 금액';
}

export default SettlementPreviewCard;