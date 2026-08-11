import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ExpenseFormDialogs } from '@/features/expense/components/ExpenseFormDialogs';
import { useExpenseFormDialogs } from '@/features/expense/hooks/useExpenseFormDialogs';
import { useExpenseForm } from '@/features/expense/hooks/useExpenseForm';
import { useExpenseFormValidation } from '@/features/expense/hooks/useExpenseFormValidation';
import { useExpenseSettle } from '@/features/expense/hooks/useExpenseSettle';
import { useSettlementAmounts } from '@/features/expense/hooks/useSettlementAmounts';
import type { Expense, ExpenseCategory, SettlementMethod } from '@/features/expense/types';
import type { User } from '@/shared/types';
import { ExpenseBasicInfoSection } from './ExpenseBasicInfoSection';
import { ExpenseFormActions } from './ExpenseFormActions';
import { ExpenseMemberSplitFields } from './ExpenseMemberSplitFields';
import { ExpenseMemberOption } from './ExpenseMemberOption';
import { ExpenseMemoField } from './ExpenseMemoField';
import { ExpenseSettlementPreview } from './ExpenseSettlementPreview';
import { EXPENSE_FORM_CARD_CLASS } from './expenseForm.styles';

interface ExpenseAddFormProps {
  members: User[];
  membersLoading?: boolean;
  selectedPayerId?: string;
  onPayerChange?: (id: string) => void;
  memberAmounts?: Record<string, number>;
  initialExpense?: Expense;
  /** 현재 로그인한 사용자 ID. 정산 완료 버튼을 선지불자 본인에게만 노출하기 위해 사용. */
  currentUserId?: string;
  onSave?: (newExpense: Expense) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  expenseId?: string;
  receiptUrl?: string;
  onShare?: (expenseId: string) => void;
  isSharing?: boolean;
  onRefresh?: () => void;
  mobileReceiptSlot?: ReactNode;
}

export const ExpenseAddForm = ({
  members,
  membersLoading,
  selectedPayerId = '',
  onPayerChange,
  memberAmounts,
  initialExpense,
  currentUserId,
  onSave,
  onCancel,
  onDelete,
  isEditMode = false,
  expenseId,
  receiptUrl,
  onShare,
  isSharing,
  onRefresh,
  mobileReceiptSlot,
}: ExpenseAddFormProps) => {
  const [currentExpenseId, setCurrentExpenseId] = useState<string | undefined>(expenseId);

  const isSettled = isEditMode && initialExpense?.status === 'paid';

  const {
    isModalOpen: isSettleMembersModalOpen,
    setIsModalOpen: setIsSettleMembersModalOpen,
    handleBulkSettle,
    handleIndividualSubmit,
    handleReject,
    modalMembers,
  } = useExpenseSettle(initialExpense, onRefresh);

  useEffect(() => {
    setCurrentExpenseId(expenseId);
  }, [expenseId]);

  const handleFormSave = (newExpense: Expense) => {
    setCurrentExpenseId(String(newExpense.id));
    onSave?.(newExpense);
  };

  const {
    title,
    setTitle,
    amount,
    setAmount,
    checkedMembers,
    toggleMember,
    settlementMethod,
    handleMethodChange,
    category,
    setCategory,
    memo,
    setMemo,
    expenseDate,
    setExpenseDate,
    payerId,
    setPayerId,
    customMemberAmounts,
    setCustomMemberAmounts,
    customMemberRatios,
    setCustomMemberRatios,
    totalRatioSum,
    isDirectInputCompleted,
    setIsDirectInputCompleted,
    isDirty,
    dateInputRef,
    handleIconClick,
    numericTotalAmount,
    totalCustomSum,
    handleSaveClick,
  } = useExpenseForm({
    initialExpense,
    selectedPayerId,
    members,
    onSave: handleFormSave,
    isEditMode,
    expenseId,
    receiptUrl,
  });

  const {
    fieldErrors,
    memberAmountErrors,
    memberRatioErrors,
    clearFieldError,
    clearMemberInputErrors,
    handleDateChange,
    handleDateBlur,
    handleAmountChange,
    handleMemberAmountChange,
    handleMemberRatioChange,
    validateForm,
    completeDirectInput,
  } = useExpenseFormValidation({
    values: {
      title,
      amount,
      expenseDate,
      payerId,
      category,
      memo,
      checkedMembers,
      settlementMethod,
      customMemberAmounts,
      customMemberRatios,
      isDirectInputCompleted,
      totalCustomSum,
      numericTotalAmount,
      totalRatioSum,
    },
    actions: {
      setAmount,
      setExpenseDate,
      setCustomMemberAmounts,
      setCustomMemberRatios,
      setIsDirectInputCompleted,
    },
  });

  const settlementAmounts = useSettlementAmounts({
    amount,
    memberIds: checkedMembers,
    settlementMethod,
    memberAmounts: memberAmounts || customMemberAmounts,
    memberRatios: customMemberRatios,
  });

  const dialogs = useExpenseFormDialogs({
    isEditMode,
    isSettled,
    isDirty,
    saveExpense: handleSaveClick,
    onCancel,
  });

  const handlePayerSelect = (value: string) => {
    setPayerId(value);
    clearFieldError('payerId');
    onPayerChange?.(value);
  };

  const handleMembersChange = (nextIds: string[]) => {
    const added = nextIds.filter(id => !checkedMembers.includes(id));
    const removed = checkedMembers.filter(id => !nextIds.includes(id));
    [...added, ...removed].forEach(id => toggleMember(id));
    if (settlementMethod !== 'EQUAL') setIsDirectInputCompleted(false);
    clearFieldError('members');
  };

  const memberCheckboxOptions = members.map(user => ({
    value: user.id,
    label: (
      <ExpenseMemberOption
        user={user}
        settlementMethod={settlementMethod}
        isChecked={checkedMembers.includes(user.id)}
        isDirectInputCompleted={isDirectInputCompleted}
        settlementAmount={settlementAmounts[user.id] ?? 0}
        customAmount={customMemberAmounts[user.id]}
        customRatio={customMemberRatios[user.id]}
        amountError={memberAmountErrors[user.id]}
        ratioError={memberRatioErrors[user.id]}
        onAmountChange={value => handleMemberAmountChange(user.id, value)}
        onRatioChange={value => handleMemberRatioChange(user.id, value)}
      />
    ),
  }));

  const handleSaveClickWithFieldValidation = () => {
    if (!validateForm()) return;
    dialogs.save.open();
  };

  // 현재 로그인한 사용자가 선지불자 본인인지 여부 (정산 완료 버튼 노출 판단용)
  const isPayer =
    Boolean(currentUserId) &&
    String(payerId) === String(currentUserId);

  return (
    <>
      {isSettled && (
        <div className="mb-4 rounded-lg bg-gray-100 px-4 py-3 text-caption text-gray-600">
          정산이 완료된 내역이라 수정할 수 없습니다.
        </div>
      )}

      <fieldset
        disabled={isSettled}
        className={`flex w-full flex-col gap-0 sm:gap-6 ${isSettled ? 'opacity-60' : ''}`}
      >
        <ExpenseBasicInfoSection
          title={title}
          amount={amount}
          expenseDate={expenseDate}
          payerId={payerId}
          category={category}
          members={members}
          membersLoading={membersLoading}
          isEditMode={isEditMode}
          errors={fieldErrors}
          dateInputRef={dateInputRef}
          onTitleChange={value => {
            setTitle(value);
            clearFieldError('title');
          }}
          onAmountChange={handleAmountChange}
          onDateChange={handleDateChange}
          onDateBlur={handleDateBlur}
          onCalendarClick={handleIconClick}
          onPayerChange={handlePayerSelect}
          onCategoryChange={(value: ExpenseCategory) => {
            setCategory(value);
            clearFieldError('category');
          }}
        />

        <div
          className={`${EXPENSE_FORM_CARD_CLASS} border-t border-gray-100 sm:border-t sm:border-gray-100`}
        >
          <h2 className="hidden font-sans text-body font-bold text-gray-800 sm:block">정산 방식</h2>

          <ExpenseMemberSplitFields
            settlementMethod={settlementMethod}
            isDirectInputCompleted={isDirectInputCompleted}
            totalRatioSum={totalRatioSum}
            totalCustomSum={totalCustomSum}
            numericTotalAmount={numericTotalAmount}
            membersLoading={membersLoading}
            memberOptions={memberCheckboxOptions}
            checkedMembers={checkedMembers}
            membersError={fieldErrors.members}
            onMethodChange={(method: SettlementMethod) => {
              handleMethodChange(method);
              clearFieldError('members');
              clearMemberInputErrors();
            }}
            onCompleteDirectInput={completeDirectInput}
            onEditDirectInput={() => setIsDirectInputCompleted(false)}
            onMembersChange={handleMembersChange}
          />

          <ExpenseMemoField
            value={memo}
            error={fieldErrors.memo}
            isEditMode={isEditMode}
            onChange={value => {
              setMemo(value);
              clearFieldError('memo');
            }}
          />

          {/* 모바일 전용: 데스크톱에서는 오른쪽 컬럼(ExpenseDetailCard + SettlementPreviewCard)이 이 역할을 대신함 */}
          <div className="sm:hidden">
            <ExpenseSettlementPreview
              title={title}
              amount={amount}
              payerId={payerId}
              members={members}
              settlementMethod={settlementMethod}
              isEditMode={isEditMode}
              isPayer={isPayer}
              onBulkSettle={dialogs.settlement.open}
              onIndividualSettle={() => setIsSettleMembersModalOpen(true)}
            />
          </div>
        </div>
      </fieldset>

      <ExpenseFormActions
        isEditMode={isEditMode}
        isSettled={isSettled}
        currentExpenseId={currentExpenseId}
        isSharing={isSharing}
        canDelete={Boolean(onDelete)}
        onSave={handleSaveClickWithFieldValidation}
        onCancel={dialogs.cancel.open}
        onDelete={onDelete}
        onShare={onShare}
      />

      {mobileReceiptSlot && <div className="-mt-2 mb-2 sm:hidden">{mobileReceiptSlot}</div>}

      <ExpenseFormDialogs
        isEditMode={isEditMode}
        expenseName={title.trim()}
        save={{
          isOpen: dialogs.save.isOpen,
          isSaving: dialogs.save.isSaving,
          errorMessage: dialogs.save.errorMessage,
          onClose: dialogs.save.close,
          onConfirm: () => void dialogs.save.confirm(),
        }}
        cancel={{
          isOpen: dialogs.cancel.isOpen,
          isPending: dialogs.save.isSaving,
          onClose: dialogs.cancel.close,
          onConfirm: dialogs.cancel.confirm,
        }}
        settlement={{
          isOpen: dialogs.settlement.isOpen,
          onClose: dialogs.settlement.close,
          onConfirm: handleBulkSettle,
        }}
        individual={{
          isOpen: isSettleMembersModalOpen,
          members: modalMembers,
          onClose: () => setIsSettleMembersModalOpen(false),
          onSubmit: handleIndividualSubmit,
          onReject: handleReject,
        }}
      />
    </>
  );
};