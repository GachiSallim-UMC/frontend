import { CustomButton } from '@/features/expense';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import type { Expense } from '@/features/expense/types/expense.types';

interface ExpenseDetailCardProps {
  expense?: Expense;
}

export function ExpenseDetailCard({ expense }: ExpenseDetailCardProps) {
  if (!expense) {
    return (
      <div className='w-full bg-white p-[24px] rounded-[18px] flex items-center justify-center text-gray-500'>
        선택된 지출 상세 내역이 없습니다.
      </div>
    );
  }

  const getSplitTypeText = (type: Expense['splitType']) => {
    switch (type) {
      case 'equal':
        return '균등 분할 (n/n)';
      case 'ratio':
        return '직접 입력';
      default:
        return '균등 분할 (n/n)';
    }
  };

  return (
    <div className='w-full bg-white p-[24px] rounded-[18px] flex flex-col gap-6'>
      <h2 className='font-sans text-body font-bold text-gray-800'>정산 상세</h2>
      
      <div className='flex flex-col gap-3 text-button text-gray-900'>
        <div className='border-b border-gray-100 p-2 flex justify-between'>
          <span className='text-gray-900'>항목</span>
          <span>{expense.title}</span>
        </div>
        <div className='border-b border-gray-100 p-2 flex justify-between'>
          <span className='text-gray-900'>총액</span>
          <span>{expense.amount.toLocaleString()}원</span>
        </div>
        <div className='border-b border-gray-100 p-2 flex justify-between'>
          <span className='text-gray-900'>선지불자</span>
          <span>{expense.payer.name}</span>
        </div>
        <div className='border-b border-gray-100 p-2 flex justify-between'>
          <span className='text-gray-900'>지출일</span>
          <span>{expense.date}</span>
        </div>
        <div className='border-b border-gray-100 p-2 flex justify-between'>
          <span className='text-gray-900'>분담 방식</span>
          <span>{getSplitTypeText(expense.splitType)}</span>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <span className='font-sans text-body font-bold text-gray-800'>멤버별 부담금</span>
        
        <div className='flex flex-col gap-3 text-button text-black'>
          {expense.shares.map((share) => {
            const isPayer = share.user.id === expense.payer.id;

            let badgeVariant: 'done' | 'pending' = 'pending';
            let badgeLabel = '미납';

            if (isPayer) {
              badgeVariant = 'done';
              badgeLabel = '선지불';
            } else if (share.isPaid) {
              badgeVariant = 'done';
              badgeLabel = '완료';
            }

            return (
              <div 
                key={share.user.id} 
                className='p-2 border-b border-gray-100 last:border-gray-900 last:border-b-[2px] flex justify-between items-center'
              >
                <span>{share.user.name}</span>
                <div className='flex items-center gap-3'>
                  <span>{share.amount.toLocaleString()}원</span>
                  <StatusBadge 
                    variant={badgeVariant} 
                    label={badgeLabel} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='flex justify-between font-bold text-body text-gray-800'>
        <span>합계</span>
        <span>{expense.amount.toLocaleString()}원</span>
      </div>

      <div className='flex gap-3 mt-2'>
        <CustomButton 
          label="전체 정산 완료" 
          variant="all" 
          onClick={() => {}} 
          className="w-[136px]"
        />
        <CustomButton 
          label="개별 완료 처리" 
          variant="each" 
          onClick={() => {}} 
          className="w-[136px]"
        />
      </div>
    </div>
  );
}

export default ExpenseDetailCard;