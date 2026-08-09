import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import {
  ExpenseAddForm,
  ExpenseDetailCard,
  Receipt,
  SettlementPreviewCard,
  useExpenseDetail,
  requestReceiptUploadUrl,
  uploadReceiptToS3,
  getReceiptViewUrl,
  useDeleteExpense,
  type Expense,
} from '@/features/expense';
import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { useGroupMembers } from '@/features/member';
import {
  ShareItemPickerModal,
  useShareToMessenger,
} from '@/features/messenger';
import { requireSelectedGroupId } from '@/shared/api';
import { ConfirmModal } from '@/shared/components/ui';
import { useAuthStore, useAlertStore, useGroupStore } from '@/shared/store';
import { enrichExpenseWithMembers, mapGroupMembersToUsers } from './expenseMembers';

interface ExpenseDetailPageProps {
  title?: string;
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

  const membersQuery = useGroupMembers(selectedGroupId);
  const members = useMemo(() => mapGroupMembersToUsers(membersQuery.data), [membersQuery.data]);
  const {
    data: expenseData,
    isLoading: expenseLoading,
    isError: expenseError,
    refetch: refetchExpense,
  } = useExpenseDetail(id);
  const savedExpense = useMemo(
    () => (expenseData ? enrichExpenseWithMembers(expenseData, members) : undefined),
    [expenseData, members],
  );
  const membersLoading = membersQuery.isLoading;
  const isGroupAdmin = membersQuery.data.some(
    member => member.userId === String(currentUserId) && member.role === 'ADMIN',
  );
  const isSubmitted = Boolean(id);
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

  const handleSave = (_newExpense: Expense) => {
    navigate('/expenses');
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

  if ((id && expenseLoading) || membersLoading) {
    return <div>지출 정보를 불러오는 중...</div>;
  }

  if (membersQuery.isError || (id && expenseError)) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-red-500">
          {membersQuery.isError
            ? '그룹원 정보를 불러오지 못했습니다.'
            : '생활비 정보를 불러오지 못했습니다.'}
        </p>
        <button
          type="button"
          className="text-button font-bold text-primary-600"
          onClick={() => {
            void membersQuery.refetch();
            if (id) void refetchExpense();
          }}
        >
          다시 시도
        </button>
      </div>
    );
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
                  <ExpenseDetailCard expense={savedExpense} />
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
