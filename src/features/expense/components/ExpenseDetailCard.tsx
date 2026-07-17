import { CustomButton } from '@/features/expense';
import type { Expense } from '@/features/expense/types/expense.types';

interface ExpenseDetailCardProps {
  expense: Expense;
}

export function ExpenseDetailCard({ expense }: ExpenseDetailCardProps) {
  return (
    <div className='w-full bg-white p-[24px] rounded-[18px] flex flex-col gap-6'>
      {/* 타이틀 */}
      <h2 className='font-sans text-body font-bold text-gray-800'>정산 상세 (등록 후 표시)</h2>
      
      {/* 기본 정보 영역 */}
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
          <span>{expense.splitType === 'equal' ? '균등 분할' : '비율 지정'}</span>
        </div>
      </div>

      {/* 멤버별 부담금 영역 */}
      <div className='flex flex-col gap-4'>
        <span className='font-sans text-body font-bold text-gray-800'>멤버별 부담금</span>
        
        <div className='flex flex-col gap-3 text-button text-black'>
          {expense.shares.map((share) => (
            <div 
              key={share.user.id} 
              className='p-2 border-b border-gray-100 last:border-gray-900 last:border-b-[2px] flex justify-between items-center'
            >
              <span>{share.user.name}</span>
              <div className='flex items-center gap-3'>
                <span>{share.amount.toLocaleString()}원</span>
                <span className={`w-[60px] h-[30px] text-[12.35px] rounded-[88.24px] font-bold flex items-center justify-center ${
                  share.isPaid 
                    ? 'bg-green-300 text-green-700' 
                    : 'bg-primary-200 text-primary-700'
                }`}>
                  {share.isPaid ? '선지불' : '미납'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 합계 영역 */}
      <div className='flex justify-between font-bold text-body text-gray-800'>
        <span>합계</span>
        <span>{expense.amount.toLocaleString()}원</span>
      </div>

      {/* 하단 버튼 영역 */}
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