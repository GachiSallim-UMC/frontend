import type { ReactNode } from 'react';
import { GroupNavigationBar } from '@/features/member';
import { GroupPageHeader } from '@/pages/member/GroupPageHeader';

interface GroupPageShellProps {
  /** 모바일 상단 바 제목 */
  title: string;
  /** 모바일 상단 바 우측 액션 */
  action?: ReactNode;
  /** 화면 하단에 고정할 영역 (그룹 생성/참여 버튼 등) */
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * 그룹 선택·생성·참여 화면의 공통 껍데기.
 * 모바일은 화면 전체를 쓰고, 데스크톱은 기존의 가운데 카드 레이아웃을 유지합니다.
 */
export const GroupPageShell = ({ title, action, footer, children }: GroupPageShellProps) => (
  <div className="flex min-h-dvh w-full flex-col bg-white lg:min-h-screen lg:items-center lg:justify-center lg:bg-primary-100">
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:h-[696px] lg:max-w-2xl lg:flex-none lg:rounded-3xl lg:bg-white lg:shadow-sm">
      <GroupNavigationBar title={title} action={action} />
      <div className="hidden lg:block">
        <GroupPageHeader />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-5 lg:px-10 lg:pb-18">
        {children}
      </div>

      {footer && <div className="shrink-0 px-4 pb-6 lg:px-10 lg:pb-10">{footer}</div>}
    </div>
  </div>
);
