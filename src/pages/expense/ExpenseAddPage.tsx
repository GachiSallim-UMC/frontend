import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExpenseAddForm,
  ExpenseDetailCard,
  Receipt,
  SettlementPreviewCard,
  getExpenseById,
  type Expense,
} from '@/features/expense';
import { memberApi } from '@/features/member';
import { requireSelectedGroupId } from '@/shared/api';
import { useAuthStore } from '@/shared/store';
import type { User } from '@/shared/types';

interface ExpenseDetailPageProps {
  title?: string;
}

function enrichExpenseWithMembers(expense: Expense, memberList: User[]): Expense {
  const memberMap = new Map(memberList.map((m) => [String(m.id), m]));

  const payer = memberMap.get(String(expense.payer.id)) ?? expense.payer;

  const shares = expense.shares?.map((share) => ({
    ...share,
    user: memberMap.get(String(share.user.id)) ?? share.user,
  }));

  return { ...expense, payer, shares };
}

export const ExpenseAddPage = ({ title: _title }: ExpenseDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const currentUserId = useAuthStore((state) => state.userId ?? undefined);

  const [members, setMembers] = useState<User[]>([]);
  const [membersLoading, setMembersLoading] = useState<boolean>(true);

  const [savedExpense, setSavedExpense] = useState<Expense | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(isEditMode);

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      setMembersLoading(true);
      try {
        const groupId = requireSelectedGroupId();
        const rawMembers = await memberApi.getGroupMembers(groupId);
        const mapped: User[] = rawMembers.map((m) => ({
          id: m.user.id,
          name: m.user.name,
          nickname: m.user.nickname,
          email: '',
          avatarUrl: m.user.profileImage ?? '',
        }));
        if (isMounted) setMembers(mapped);
      } catch (err) {
        console.error('그룹 멤버 조회 실패:', err);
      } finally {
        if (isMounted) setMembersLoading(false);
      }
    };

    fetchMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchExpenseDetail = async () => {
      if (!id) return;
      if (membersLoading) return;

      setIsLoading(true);
      try {
        const data = await getExpenseById(id);
        if (isMounted) {
          setSavedExpense(enrichExpenseWithMembers(data, members));
        }
      } catch (err) {
        console.error('지출 단건 조회 실패:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchExpenseDetail();

    return () => {
      isMounted = false;
    };
  }, [id, membersLoading, members]);

  const handleSave = (newExpense: Expense) => {
    setSavedExpense(enrichExpenseWithMembers(newExpense, members));
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isEditMode && isLoading) {
    return (
      <div className='flex justify-center items-center w-full flex-1 min-h-[300px] lg:min-h-[400px] text-gray-400'>
        지출 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center mt-4 lg:mt-[28px] w-full flex-1 min-h-0 bg-gray-50 pb-8 lg:pb-12'>
      <div className='flex flex-col w-full items-center px-3 sm:px-4'>
        <div className='w-full max-w-[1200px] flex flex-col gap-4 lg:gap-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start w-full'>
            <div className='flex flex-col gap-4 lg:gap-6 w-full'>
              <ExpenseAddForm
                members={members}
                membersLoading={membersLoading}
                initialExpense={savedExpense}
                onSave={handleSave}
                onCancel={handleCancel}
                isEditMode={isEditMode}
                expenseId={id}
              />
            </div>

            <div className='flex flex-col gap-4 lg:gap-6 w-full'>
              {isSubmitted && savedExpense ? (
                <>
                  <ExpenseDetailCard expense={savedExpense} />
                  <Receipt />
                  <SettlementPreviewCard expense={savedExpense} currentUserId={currentUserId} />
                </>
              ) : (
                <SettlementPreviewCard currentUserId={currentUserId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAddPage;