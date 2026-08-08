import { cn } from '@/shared/lib';

interface GroupOrDividerProps {
  className?: string;
}

/** 선 가운데에 "또는" 라벨이 얹힌 구분선. 그룹 선택·빈 상태 화면에서 공통으로 씁니다. */
export const GroupOrDivider = ({ className }: GroupOrDividerProps) => (
  <div className={cn('relative flex items-center justify-center py-5', className)}>
    <div className="absolute inset-x-0 h-px bg-gray-100" />
    <span className="relative bg-white px-3 text-mobile-caption font-bold text-gray-200 lg:text-xs">
      또는
    </span>
  </div>
);
