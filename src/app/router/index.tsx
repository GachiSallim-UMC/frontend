import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PlaceholderPage } from '@/pages/_shared/PlaceholderPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AppLayout } from './AppLayout';
import { ExpenseListPage } from '@/pages/expense';
import { NotificationPage } from '@/pages/notification';
import { ChorePage } from '@/pages/chore/ChorePage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';


export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/chores', element: <ChorePage /> },
      { path: '/chores/new', element: <PlaceholderPage title="집안일 등록" /> },
      { path: '/chores/:id/edit', element: <PlaceholderPage title="집안일 수정" /> },
      { path: '/expenses', element: <ExpenseListPage title="생활비 정산" /> },
      { path: '/expenses/new', element: <PlaceholderPage title="생활비 등록" /> },
      { path: '/expenses/:id', element: <PlaceholderPage title="정산 상세" /> },
      { path: '/items', element: <PlaceholderPage title="공용 물품" /> },
      { path: '/items/new', element: <PlaceholderPage title="물품 등록" /> },
      { path: '/items/:id/edit', element: <PlaceholderPage title="물품 수정" /> },
      { path: '/rules', element: <PlaceholderPage title="생활 규칙" /> },
      { path: '/rules/new', element: <PlaceholderPage title="규칙 등록" /> },
      { path: '/rules/:id', element: <PlaceholderPage title="규칙 상세" /> },
      { path: '/messenger', element: <PlaceholderPage title="메신저" /> },
      { path: '/notifications', element: <NotificationPage /> },
      { path: '/activity', element: <PlaceholderPage title="활동 내역" /> },
      { path: '/mypage', element: <PlaceholderPage title="마이페이지" /> },
      { path: '/group/settings', element: <PlaceholderPage title="그룹 설정" /> },
      { path: '/group/change', element: <PlaceholderPage title="그룹 변경" /> },
    ],
  },
]);
