import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface GroupNavigationBarProps {
  title: string;
  /** 우측 액션 영역. 없으면 가운데 정렬을 위해 빈 자리만 차지합니다. */
  action?: ReactNode;
  /** 지정하면 해당 경로로, 없으면 이전 화면으로 이동합니다. */
  backTo?: string;
}

/**
 * 그룹 선택·생성·참여 화면의 모바일 상단 바.
 * 데스크톱에서는 GroupSelectHeader를 쓰므로 lg부터 숨깁니다.
 */
export const GroupNavigationBar = ({ title, action, backTo }: GroupNavigationBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-[52px] shrink-0 border-b border-gray-100 bg-white lg:hidden">
      <div className="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center px-4">
        <div className="justify-self-start">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="flex size-8 items-center justify-start text-gray-900"
          >
            <ArrowLeft className="size-6" strokeWidth={1.5} />
          </button>
        </div>
        <h1 className="max-w-[210px] truncate text-mobile-title font-bold tracking-[0.04em] text-gray-900">
          {title}
        </h1>
        <div className="justify-self-end text-mobile-body text-gray-400">{action}</div>
      </div>
    </header>
  );
};
