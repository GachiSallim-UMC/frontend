
export type ExpenseFilter = 'TOTAL' | 'THIS_MONTH';

interface TabButtonProps {
  label: string;
  filter: ExpenseFilter;
  activeFilter: ExpenseFilter;
  onFilterChange: (filter: ExpenseFilter) => void;
}

const TabButton = ({ label, filter, activeFilter, onFilterChange }: TabButtonProps) => {
  const baseStyle = 'px-[20px] sm:w-[148px] sm:px-0 h-[44px] lg:h-[50px] rounded-[8px] border-[1px] transition-all flex items-center justify-center font-sans font-normal text-button whitespace-nowrap'

  const isActive = activeFilter === filter;
  const activeStyle = 'bg-blue-100 border-blue-500 text-blue-500'
  const inactiveStyle = 'bg-gray-0 border-gray-100 text-gray-400'

  return (
    <button
      onClick={() => onFilterChange(filter)}
      className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
    >
      {label}
    </button>
  )
}

export default TabButton