import { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import {
  ExpenseAddForm,
  ExpenseDetailCard,
  Receipt,
  SettlementPreviewCard,
  getExpenseById,
  requestReceiptUploadUrl,
  uploadReceiptToS3,
  getReceiptViewUrl,
  useDeleteExpense,
  type Expense,
} from '@/features/expense';
import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { memberApi } from '@/features/member';
import {
  ShareItemPickerModal,
  useShareToMessenger,
} from '@/features/messenger';
import { requireSelectedGroupId } from '@/shared/api';
import { ConfirmModal } from '@/shared/components/ui';
import { useAuthStore, useAlertStore, useGroupStore } from '@/shared/store';
import type { User } from '@/shared/types';

interface ExpenseDetailPageProps {
  title?: string;
}

function enrichExpenseWithMembers(
  expense: Expense,
  memberList: User[],
): Expense {
  const memberMap = new Map(
    memberList.map((m) => [String(m.id), m]),
  );

  const payer =
    memberMap.get(String(expense.payer.id)) ?? expense.payer;

  const shares = expense.shares?.map((share) => ({
    ...share,
    user:
      memberMap.get(String(share.user.id)) ?? share.user,
  }));

  return { ...expense, payer, shares };
}

export const ExpenseAddPage = ({
  title: _title,
}: ExpenseDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUserId = useAuthStore(
    (state) => state.userId ?? undefined,
  );

  const selectedGroupId = useGroupStore(
    (state) => state.selectedGroupId,
  );

  const {
    activeType,
    chatRoomOptions,
    openShare,
    closeShare,
    handleSelectChatRoom,
    isSharePending,
  } = useShareToMessenger('expense');

  const [members, setMembers] = useState<User[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);

  const [savedExpense, setSavedExpense] = useState<
    Expense | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState(!!id);
  const [isSubmitted, setIsSubmitted] = useState(!!id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteExpense = useDeleteExpense();

  const isEditMode = !!id || !!savedExpense;

  const isExpenseCreator = Boolean(
    savedExpense?.createdById &&
      currentUserId &&
      savedExpense.createdById === String(currentUserId),
  );

  const isSelectedGroupExpense = Boolean(
    savedExpense?.groupId &&
      selectedGroupId &&
      savedExpense.groupId === selectedGroupId,
  );

  const canDeleteExpense = Boolean(
    savedExpense &&
      isSelectedGroupExpense &&
      (isExpenseCreator || isGroupAdmin),
  );

  const [receiptObjectKey, setReceiptObjectKey] = useState<
    string | undefined
  >(undefined);

  const [receiptViewUrl, setReceiptViewUrl] = useState<
    string | undefined
  >(undefined);

  const [isReceiptUploading, setIsReceiptUploading] =
    useState(false);

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

        if (isMounted) {
          setMembers(mapped);
          setIsGroupAdmin(
            rawMembers.some(
              (member) =>
                member.userId === String(currentUserId) &&
                member.role === 'ADMIN',
            ),
          );
        }
      } catch (err) {
        console.error('그룹 멤버 조회 실패:', err);

        if (isMounted) {
          setIsGroupAdmin(false);
        }
      } finally {
        if (isMounted) {
          setMembersLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

  useEffect(() => {
    let isMounted = true;

    const fetchExpenseDetail = async () => {
      if (!id) return;
      if (membersLoading) return;

      setIsLoading(true);

      try {
        const data = await getExpenseById(id);

        if (isMounted) {
          setSavedExpense(
            enrichExpenseWithMembers(data, members),
          );
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

        if (isMounted) {
          setReceiptViewUrl(viewUrl);
        }
      } catch (err) {
        console.error('영수증 이미지 조회 실패:', err);

        if (isMounted) {
          setReceiptViewUrl(undefined);
        }
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

      const { uploadUrl, fields, objectKey } =
        await requestReceiptUploadUrl({
          groupId: Number(groupId),
          contentType: file.type as
            | 'image/jpeg'
            | 'image/png'
            | 'image/webp',
          fileSize: file.size,
        });

      await uploadReceiptToS3(uploadUrl, fields, file);
      setReceiptObjectKey(objectKey);
    } catch (err) {
      console.error('영수증 업로드 실패:', err);

      useAlertStore.getState().showAlert({
        title: '오류',
        message: '영수증 업로드에 실패했습니다.',
      });
    } finally {
      setIsReceiptUploading(false);
    }
  };

  const handleSave = (newExpense: Expense) => {
    setSavedExpense(
      enrichExpenseWithMembers(newExpense, members),
    );
    setIsSubmitted(true);
    navigate('/expenses');
  };

  const handleExpenseRefresh = async () => {
    const targetId = savedExpense?.id ?? id;

    if (!targetId) return;

    try {
      const data = await getExpenseById(targetId);

      setSavedExpense(
        enrichExpenseWithMembers(data, members),
      );
    } catch (err) {
      console.error('지출 정산 정보 갱신 실패:', err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDeleteClick = () => {
    deleteExpense.reset();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const targetId = savedExpense?.id ?? id;

    if (!targetId || !canDeleteExpense) return;

    try {
      await deleteExpense.mutateAsync(targetId);
      setIsDeleteModalOpen(false);
      navigate('/expenses');
    } catch {
      // 삭제 실패 시 모달 유지
    }
  };

  if (id && isLoading) {
    return <div>지출 정보를 불러오는 중...</div>;
  }

  if (
    id &&
    savedExpense?.groupId &&
    savedExpense.groupId !== selectedGroupId
  ) {
    return <Navigate to="/expenses" replace />;
  }

  return (
    <div className="w-full bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="min-w-0 w-full">
            <ExpenseAddForm
              members={members}
              membersLoading={membersLoading}
              initialExpense={savedExpense}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={
                canDeleteExpense
                  ? handleDeleteClick
                  : undefined
              }
              isEditMode={isEditMode}
              expenseId={
                savedExpense?.id
                  ? String(savedExpense.id)
                  : id
              }
              receiptUrl={receiptObjectKey}
              onShare={openShare}
              isSharing={isSharePending}
              onRefresh={handleExpenseRefresh}
              mobileReceiptSlot={
                <Receipt
                  imageUrl={receiptViewUrl}
                  onImageChange={handleReceiptChange}
                  disabled={
                    isReceiptUploading ||
                    savedExpense?.status === 'paid'
                  }
                  isUploading={isReceiptUploading}
                />
              }
            />
          </div>

          <div className="flex min-w-0 w-full flex-col gap-4">
            {isSubmitted && savedExpense ? (
              <>
                {/* 모바일에서는 폼의 "정산 미리보기" 섹션에 이미 동일한 정보 + 전체/개별 정산 버튼이 있으므로 중복 방지를 위해 숨김 */}
                <div className="hidden sm:block">
                  <ExpenseDetailCard
                    expense={savedExpense}
                    onRefresh={handleExpenseRefresh}
                  />
                </div>

                {/* 모바일에서는 폼의 mobileReceiptSlot에 이미 동일한 영수증 첨부가 있으므로 중복 방지를 위해 숨김 */}
                <div className="hidden sm:block">
                  <Receipt
                    imageUrl={receiptViewUrl}
                    onImageChange={handleReceiptChange}
                    disabled={
                      isReceiptUploading ||
                      savedExpense.status === 'paid'
                    }
                    isUploading={isReceiptUploading}
                  />
                </div>

                <SettlementPreviewCard
                  expense={savedExpense}
                  currentUserId={currentUserId}
                  onRefresh={handleExpenseRefresh}
                />
              </>
            ) : (
              <>
                <div className="hidden sm:block">
                  <Receipt
                    onImageChange={handleReceiptChange}
                    disabled={isReceiptUploading}
                    isUploading={isReceiptUploading}
                  />
                </div>

                <SettlementPreviewCard
                  currentUserId={currentUserId}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <ShareItemPickerModal
        type={activeType}
        options={chatRoomOptions}
        onSelect={handleSelectChatRoom}
        onClose={closeShare}
        isSubmitting={isSharePending}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => void handleConfirmDelete()}
        icon={<ExpenseIcon className="size-6" />}
        title="정말 삭제하시겠어요?"
        highlight={savedExpense?.title}
        description="데이터를 삭제합니다. 삭제된 데이터는 복구할 수 없습니다."
        confirmLabel="영구 삭제"
        isPending={deleteExpense.isPending}
        errorMessage={
          deleteExpense.error instanceof Error
            ? deleteExpense.error.message
            : deleteExpense.isError
              ? '생활비 삭제에 실패했습니다. 다시 시도해 주세요.'
              : undefined
        }
        tone="danger"
      />
    </div>
  );
};

export default ExpenseAddPage;