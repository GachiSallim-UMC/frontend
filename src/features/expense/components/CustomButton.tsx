import React from 'react';

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'all' | 'each' | 'settlement';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // API 연동 함수 연결용
}

export const CustomButton = ({
  label,
  variant = 'all',
  className = '',
  onClick,
  ...props
}: CustomButtonProps) => {

  const baseStyle = 'font-sans text-caption transition-all flex items-center justify-center cursor-pointer gap-[4px]';


  const variantStyles = {
    all: 'h-[45px] rounded-[4px] bg-gray-900 text-white',
    each: 'h-[45px] rounded-[4px] bg-white border-[1px] border-gray-900',
    settlement: 'h-[50px] rounded-[8px] font-bold bg-primary-600 text-white',
  };

  return (
    <button
      type="button"
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};