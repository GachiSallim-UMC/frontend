import type { Expense } from '@/features/expense';
import type { GroupMemberResponse } from '@/features/member';
import type { User } from '@/shared/types';

export const mapGroupMembersToUsers = (members: GroupMemberResponse[]): User[] =>
  members.map(member => ({
    id: member.user.id,
    name: member.user.nickname || member.user.name,
    nickname: member.user.nickname,
    email: '',
    avatarUrl: member.user.profileImage ?? undefined,
  }));

export const enrichExpenseWithMembers = (expense: Expense, members: User[]): Expense => {
  const memberMap = new Map(members.map(member => [String(member.id), member]));
  const payer = memberMap.get(String(expense.payer.id)) ?? expense.payer;
  const shares = expense.shares?.map(share => ({
    ...share,
    user: memberMap.get(String(share.user.id)) ?? share.user,
  }));

  return { ...expense, payer, shares };
};
