import React from 'react'

interface ExpenseSummaryCardProps {
  label: string;
  amount: number;
  subText: string;
  icon: React.ReactNode;
}

const ExpenseSummaryCard = ({ label, amount, subText, icon }: ExpenseSummaryCardProps) => {
  return (
    <div className='w-full sm:w-[calc(50%-8px)] lg:w-[360px] lg:h-[147px] rounded-[18px] bg-gray-0 flex items-center pl-[24px] py-[20px] lg:py-0 gap-[16px]'>
      <div className='w-[76.08px] h-[77.33px] bg-orange-100 flex items-center justify-center shrink-0 rounded-full'>
        {icon}
      </div>

      <div className='flex flex-col gap-[4px]'>
        <span className='font-sans font-bold text-caption leading-[18.71px] tracking-[0.62px] text-gray-600'>
          {label}
        </span>
        <span className='font-sans font-bold text-key-number leading-[37.42px] text-gray-900'>
          {amount.toLocaleString()}원
        </span>
        <span className='font-sans font-normal text-caption leading-[18.71px] text-gray-500'>
          {subText}
        </span>
      </div>
    </div>
  )
}

export default ExpenseSummaryCard