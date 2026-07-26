import React from 'react';

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'all' | 'each' | 'settlement'; 
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // API 연동 함수 연결용
}

export const CustomButton = ({ 
  label, 
  variant = 'primary', 
  className = '', 
  onClick,
  ...props 
}: CustomButtonProps) => {

  const baseStyle = 'font-sans text-caption transition-all flex items-center justify-center cursor-pointer gap-[4px]';
  
  
  const variantStyles = {
    primary: 'h-[50px] rounded-[8px] font-bold bg-primary-600 text-white',
    secondary: 'h-[50px] rounded-[8px] font-bold bg-white border-[1px] border-gray-100 text-gray-500 ',
    all: 'h-[45px] rounded-[4px] bg-gray-900 text-white',
    each: 'h-[45px] rounded-[4px] bg-white border-[1px] border-gray-900',
    settlement:'h-[50px] rounded-[8px] font-bold bg-primary-600 text-white'
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

