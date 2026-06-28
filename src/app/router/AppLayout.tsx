import { Outlet } from 'react-router-dom';
import { PageLayout } from '@/shared/components/layout';

/** 사이드바 + 헤더가 있는 공통 레이아웃으로 라우트 children을 감쌉니다. */
export const AppLayout = () => (
  <PageLayout>
    <Outlet />
  </PageLayout>
);
