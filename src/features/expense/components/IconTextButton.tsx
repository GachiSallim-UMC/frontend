import React from 'react';

export interface IconTextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  iconComponent?: React.ComponentType<{ className?: string }>;
  iconSrc?: string;
  variant?: 'message' | 'toss' ;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function IconTextButton({
  label,
  iconComponent: Icon,
  iconSrc,
  variant = 'message',
  className = '',
  onClick,
  ...props
}: IconTextButtonProps) {
  const baseStyle = 'h-[50px] px-4 rounded-[8px] font-sans text-button transition-all flex items-center justify-center gap-2 cursor-pointer';

  const variantStyles = {
    message: 'border border-dashed border-primary-500 text-primary-500 bg-white',
    toss: 'border-[1px] border-primary-500 text-primary-500 bg-white',
  };

  return (
    <button
      type="button"
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-primary-500" />}
      {iconSrc && <img src={iconSrc} alt="" className="w-5 h-5 object-contain" />}
      <span>{label}</span>
    </button>
  );
}