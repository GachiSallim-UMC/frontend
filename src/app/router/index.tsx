import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { AppLayout } from './AppLayout';
import { RequireAuth } from './RequireAuth';
import { RequireGroup } from './RequireGroup';
import { ExpenseListPage, ExpenseAddPage } from '@/pages/expense';
import { ItemListPage, ItemFormPage, ItemEditRoute } from '@/pages/item';
import { RuleListPage, RuleFormPage, RuleDetailRoute } from '@/pages/rule';
import { NotificationPage } from '@/pages/notification';
import { ChoreListPage } from '@/pages/chore/ChoreListPage';
import { ChoreCreatePage } from '@/pages/chore/ChoreCreatePage';
import { ChoreEditPage } from '@/pages/chore/ChoreEditPage';
import { MyPage } from '@/pages/mypage/MyPage';
import { SendingEmailPage } from '@/pages/auth/SendingEmailPage';
import { EmailSentPage } from '@/pages/auth/EmailSentPage';
import { GroupSelectPage } from '@/pages/member/GroupSelectPage';
import { AddGroupPage } from '@/pages/member/AddGroupPage';
import { JoinGroupPage } from '@/pages/member/JoinGroupPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';

import { TermsPage } from '@/pages/auth/TermsPage';
import { PrivacyPage } from '@/pages/auth/PrivacyPage';
import { MemberSettingPage } from '@/pages/member/MemberSettingPage';
import { MessengerPage } from '@/pages/messenger';
import { ActivityPage } from '@/pages/activity';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/find-password', element: <SendingEmailPage /> },
  { path: '/find-password/sent', element: <EmailSentPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/group', element: <GroupSelectPage /> },
      { path: '/group/add', element: <AddGroupPage /> },
      { path: '/group/join', element: <JoinGroupPage /> },
      {
        element: <RequireGroup />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: '/dashboard/:groupId', element: <DashboardPage /> },
              { path: '/chores', element: <ChoreListPage /> },
              { path: '/chores/new', element: <ChoreCreatePage /> },
              { path: '/chores/:id/edit', element: <ChoreEditPage /> },
              { path: '/expenses', element: <ExpenseListPage  /> },
              { path: '/expenses/new', element: <ExpenseAddPage /> },
              { path: '/expenses/:id', element: <ExpenseAddPage /> },
              { path: '/items', element: <ItemListPage /> },
              { path: '/items/new', element: <ItemFormPage /> },
              { path: '/items/:id/edit', element: <ItemEditRoute /> },
              { path: '/rules', element: <RuleListPage /> },
              { path: '/rules/new', element: <RuleFormPage /> },
              { path: '/rules/:id', element: <RuleDetailRoute /> },
              { path: '/messenger', element: <MessengerPage /> },
              { path: '/notifications', element: <NotificationPage /> },
              { path: '/activity', element: <ActivityPage /> },
              { path: '/mypage', element: <MyPage /> },
              { path: '/group/settings', element: <MemberSettingPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
