import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PlaceholderPage } from '@/pages/_shared/PlaceholderPage';
import { RuleListPage, RuleDetailRoute, RuleFormPage } from '@/pages/rule';
import { ItemListPage, ItemFormPage, ItemEditRoute } from '@/pages/item';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AppLayout } from './AppLayout';
import { NotificationPage } from '@/pages/notification';
import { ChoreListPage } from '@/pages/chore/ChoreListPage';
import { ChoreCreatePage } from '@/pages/chore/ChoreCreatePage';
import { ChoreEditPage } from '@/pages/chore/ChoreEditPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <PlaceholderPage title="대시보드" /> },
      { path: '/chores', element: <ChoreListPage /> },
      { path: '/chores/new', element: <ChoreCreatePage /> },
      { path: '/chores/:id/edit', element: <ChoreEditPage /> },
      { path: '/expenses', element: <PlaceholderPage title="생활비 정산" /> },
      { path: '/expenses/new', element: <PlaceholderPage title="생활비 등록" /> },
      { path: '/expenses/:id', element: <PlaceholderPage title="정산 상세" /> },
      { path: '/items', element: <ItemListPage /> },
      { path: '/items/new', element: <ItemFormPage /> },
      { path: '/items/:id/edit', element: <ItemEditRoute /> },
      { path: '/rules', element: <RuleListPage /> },
      { path: '/rules/new', element: <RuleFormPage /> },
      { path: '/rules/:id', element: <RuleDetailRoute /> },
      { path: '/messenger', element: <PlaceholderPage title="메신저" /> },
      { path: '/notifications', element: <NotificationPage /> },
      { path: '/activity', element: <PlaceholderPage title="활동 내역" /> },
      { path: '/mypage', element: <PlaceholderPage title="마이페이지" /> },
      { path: '/group/settings', element: <PlaceholderPage title="그룹 설정" /> },
      { path: '/group/change', element: <PlaceholderPage title="그룹 변경" /> },
    ],
  },
]);
