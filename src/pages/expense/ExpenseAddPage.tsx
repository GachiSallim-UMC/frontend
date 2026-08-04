import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExpenseAddForm,
  ExpenseDetailCard,
  Receipt,
  SettlementPreviewCard,
  getExpenseById,
  requestReceiptUploadUrl,
  uploadReceiptToS3,
  getReceiptViewUrl,
  type Expense,
} from '@/features/expense';
import { memberApi } from '@/features/member';
import { requireSelectedGroupId } from '@/shared/api';
import { useAuthStore, useErrorStore } from '@/shared/store';
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

  const currentUserId = useAuthStore((state) => state.userId ?? undefined);

  const [members, setMembers] = useState<User[]>([]);
  const [membersLoading, setMembersLoading] = useState<boolean>(true);

  const [savedExpense, setSavedExpense] = useState<Expense | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!id);

  const isEditMode = !!id || !!savedExpense;

  const [receiptObjectKey, setReceiptObjectKey] = useState<string | undefined>(undefined);
  const [receiptViewUrl, setReceiptViewUrl] = useState<string | undefined>(undefined);
  const [isReceiptUploading, setIsReceiptUploading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      setMembersLoading(true);
      try {
        const groupId = requireSelectedGroupId();
        const rawMembers = await memberApi.getGroupMembers(groupId);
        const mapped: User[] = rawMembers.map((m) => ({
          id: m.user.id,
          name: m.user.nickname || m.user.name,
          nickname: m.user.nickname,
          email: '',
          avatarUrl: m.user.profileImage ?? undefined,
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

  useEffect(() => {
    let isMounted = true;

    const fetchReceiptViewUrl = async () => {
      if (!savedExpense?.id) return;
      try {
        const viewUrl = await getReceiptViewUrl(savedExpense.id);
        if (isMounted) setReceiptViewUrl(viewUrl);
      } catch (err) {
        console.error('영수증 이미지 조회 실패:', err);
        if (isMounted) setReceiptViewUrl(undefined);
      }
    };

    fetchReceiptViewUrl();

    return () => {
      isMounted = false;
    };
  }, [savedExpense?.id]);

  const handleReceiptChange = async (file: File) => {
    setIsReceiptUploading(true);
    try {
      const groupId = requireSelectedGroupId();
      const { uploadUrl, fields, objectKey } = await requestReceiptUploadUrl({
        groupId: Number(groupId),
        contentType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
        fileSize: file.size,
      });
      await uploadReceiptToS3(uploadUrl, fields, file);
      setReceiptObjectKey(objectKey);
    } catch (err) {
      console.error('영수증 업로드 실패:', err);
      useErrorStore.getState().showError({
        title: '오류',
        message: '영수증 업로드에 실패했습니다.',
      });
    } finally {
      setIsReceiptUploading(false);
    }
  };

  const handleSave = async (newExpense: Expense) => {
    setSavedExpense(enrichExpenseWithMembers(newExpense, members));
    setIsSubmitted(true);

    if (!id) {
      navigate(`/expenses/${newExpense.id}`, { replace: true });
    }

    if (receiptObjectKey) {
      try {
        const viewUrl = await getReceiptViewUrl(newExpense.id);
        setReceiptViewUrl(viewUrl);
      } catch (err) {
        console.error('영수증 조회 URL 갱신 실패:', err);
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (id && isLoading) {
    return (
      <div className='flex justify-center items-center w-full flex-1 min-h-[300px] lg:min-h-[400px] text-gray-400'>
        지출 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className='flex flex-col mt-4 lg:mt-[28px] w-full flex-1 min-h-0 pb-8 lg:pb-12'>
      <div className='flex flex-col w-full px-3 sm:px-4 lg:px-0'>
        <div className='w-full max-w-[1114px] flex flex-col gap-4 lg:gap-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start w-full'>
            <div className='flex flex-col gap-4 lg:gap-6 w-full'>
              <ExpenseAddForm
                members={members}
                membersLoading={membersLoading}
                initialExpense={savedExpense}
                onSave={handleSave}
                onCancel={handleCancel}
                isEditMode={isEditMode}
                expenseId={savedExpense?.id ? String(savedExpense.id) : id}
                receiptUrl={receiptObjectKey}
              />
            </div>

            <div className='flex flex-col gap-4 lg:gap-6 w-full'>
              {isSubmitted && savedExpense ? (
                <>
                  <ExpenseDetailCard expense={savedExpense} />
                  <Receipt
                    imageUrl={receiptViewUrl}
                    onImageChange={handleReceiptChange}
                    disabled={isReceiptUploading || savedExpense.status === 'paid'}
                    isUploading={isReceiptUploading}
                  />
                  <SettlementPreviewCard expense={savedExpense} currentUserId={currentUserId} />
                </>
              ) : (
                <>
                  <Receipt
                    onImageChange={handleReceiptChange}
                    disabled={isReceiptUploading}
                    isUploading={isReceiptUploading}
                  />
                  <SettlementPreviewCard currentUserId={currentUserId} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAddPage;