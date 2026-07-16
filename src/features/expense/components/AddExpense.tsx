
import plusIcon from '@/assets/icons/expense/plus.svg';

interface AddExpenseProps {
  onClick?: () => void;
}

const AddExpense = ({ onClick }: AddExpenseProps) => {

  return (
    <button 
    onClick={onClick}
    className='w-full sm:w-[152px] h-[44px] lg:h-[50px] rounded-[8px] bg-primary-600 flex items-center justify-center shrink-0 gap-[7px]'>
      <img src={plusIcon} alt='생활비등록' className='w-[13px] h-[13px]' />
      <span className='font-sans font-normal text-button text-white whitespace-nowrap'>
        생활비 등록
      </span>
    </button>
  )
}

export default AddExpense