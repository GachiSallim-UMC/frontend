import type { Expense } from '@/features/expense';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { useNavigate } from 'react-router-dom';
import { useLongPress, useShareExpense } from '@/features/expense';
import { deleteExpense } from '@/features/expense';

interface ExpenseRowProps {
  expense: Expense;
  onDeleteSuccess?: (id: number | string) => void;
}

const GRID_COLS = 'grid-cols-[114fr_166fr_150fr_157fr_163fr_176fr_78fr]';

const SPLIT_TYPE_LABEL: Record<string, string> = {
  EQUAL: '균등 분할 (n/n)',
  CUSTOM: '직접 입력',
  RATIO: '비율 분할',
};

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}/${dd}`;
}

export const ExpenseRow = ({ expense, onDeleteSuccess }: ExpenseRowProps) => {
  const navigate = useNavigate();
  const { shareExpense, isSharing } = useShareExpense();
  const displayAmount = typeof expense.amount === 'number' ? expense.amount : 0;

  const statusStyle = expense.status === 'paid'
    ? 'bg-green-100 text-green-700'
    : 'bg-orange-100 text-orange-700';

  const handleRowClick = () => {
    navigate(`/expenses/${expense.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/expenses/${expense.id}`);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareExpense(expense.id);
  };

  const handleLongPressDelete = async () => {
    const confirmed = window.confirm('이 지출 내역을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await deleteExpense(expense.id);
      onDeleteSuccess?.(expense.id);
    } catch (err) {
      console.error('지출 삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const longPressHandlers = useLongPress({
    onLongPress: handleLongPressDelete,
  });

  return (
    <div
      {...longPressHandlers}
      onClick={handleRowClick}
      className={`grid ${GRID_COLS} items-center w-full min-w-[720px] h-[72px] pl-[20px] pr-[16px] lg:pl-[30px] lg:pr-[25px] bg-white border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50`}
    >
      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {formatDate(expense.date)}
      </span>

      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {expense.title || '제목 없음'}
      </span>

      <div className='flex items-center gap-[12px]'>
        {expense.payer?.avatarUrl ? (
          <img
            src={expense.payer.avatarUrl}
            alt={expense.payer?.name || '유저'}
            className='w-[34px] h-[34px] rounded-full object-cover bg-gray-500'
          />
        ) : (
          <div className='w-[34px] h-[34px] rounded-full bg-gray-300' />
        )}
        <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
          {expense.payer?.name ?? '알 수 없음'}
        </span>
      </div>

      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {displayAmount.toLocaleString()}원
      </span>

      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {SPLIT_TYPE_LABEL[expense.splitType] ?? '균등 분할 (n/n)'}
      </span>

      <div className={`w-[68px] h-[34px] rounded-[100px] flex items-center justify-center whitespace-nowrap ${statusStyle}`}>
        {expense.status === 'paid' ? '완료' : '미정산'}
      </div>

      <div className='flex items-center'>
        <button
          onClick={handleEditClick}
          className='w-[39px] h-[39px] flex items-center justify-center text-gray-400 cursor-pointer hover:text-gray-600'
        >
          <EditIcon />
        </button>
        <button
          onClick={handleShareClick}
          disabled={isSharing}
          className='w-[39px] h-[39px] flex items-center justify-center text-gray-400 cursor-pointer hover:text-gray-600'
        >
          <ShareIcon />
        </button>
      </div>
    </div>
  );
};