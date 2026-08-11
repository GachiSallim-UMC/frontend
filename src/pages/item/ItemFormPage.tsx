import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ITEM_CATEGORY_OPTIONS,
  ITEM_STATUS_OPTIONS,
  useCreateItem,
  useDeleteItem,
  useItemForm,
  useItems,
  useQuickItemStatus,
  useUpdateItem,
  useUpdateItemStatus,
  type Item,
} from '@/features/item';
import { useGroupMembers } from '@/features/member';
import ItemIcon from '@/assets/icons/sidebar/items.svg?react';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';
import {
  Button,
  ConfirmModal,
  FormActions,
  FormCancelModal,
  ShareMessengerButton,
} from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import { useAuthStore, useGroupStore } from '@/shared/store';

type FormErrors = Partial<Record<'name' | 'category' | 'status' | 'memo', string>>;

export const ItemFormPage = () => {
  const { id } = useParams();
  const { data: items = [], isLoading, error } = useItems();
  const editingItem = id ? items.find(item => item.id === id) : undefined;

  if (id && isLoading) {
    return <p className="mt-16 text-center text-gray-500">공용물품을 불러오는 중입니다.</p>;
  }

  if (id && error) {
    return (
      <p className="mt-16 text-center text-gray-500">
        {error instanceof Error ? error.message : '공용물품을 불러오지 못했습니다.'}
      </p>
    );
  }

  if (id && !editingItem) {
    return <Navigate to="/items" replace />;
  }

  return <ItemFormContent editingItem={editingItem} items={items} />;
};

interface ItemFormContentProps {
  editingItem?: Item;
  items: Item[];
}

const ItemFormContent = ({ editingItem, items }: ItemFormContentProps) => {
  const navigate = useNavigate();
  const groupId = useGroupStore(state => state.selectedGroupId);
  const currentUserId = useAuthStore(state => state.userId);
  const {
    name,
    setName,
    category,
    setCategory,
    status,
    setStatus,
    buyerId,
    setBuyerId,
    memo,
    setMemo,
    isDirty,
  } = useItemForm(editingItem);
  const {
    itemId: quickItemId,
    setItemId: setQuickItemId,
    status: quickStatus,
    setStatus: setQuickStatus,
  } = useQuickItemStatus();
  const { data: groupMembers, error: groupMembersError } = useGroupMembers(groupId);
  const createItem = useCreateItem();
  const deleteItem = useDeleteItem();
  const updateItem = useUpdateItem();
  const updateStatus = useUpdateItemStatus();
  const {
    activeType,
    chatRoomOptions,
    openShare,
    closeShare,
    handleSelectChatRoom,
    isSharePending,
  } = useShareToMessenger('item');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const buyerOptions = groupMembers.map(member => ({
    value: member.userId,
    label: member.user.nickname || member.user.name || `멤버 ${member.userId}`,
  }));

  if (editingItem?.buyer && !buyerOptions.some(option => option.value === editingItem.buyer?.id)) {
    buyerOptions.push({
      value: editingItem.buyer.id,
      label: editingItem.buyer.nickname,
    });
  }

  const isGroupAdmin = groupMembers.some(
    member => member.userId === currentUserId && member.role === 'ADMIN',
  );
  const isSelectedGroupItem = Boolean(
    editingItem?.groupId && groupId && editingItem.groupId === groupId,
  );
  const isItemCreator = Boolean(
    editingItem?.createdBy?.id && currentUserId && editingItem.createdBy.id === currentUserId,
  );
  const canDeleteItem = Boolean(
    editingItem && isSelectedGroupItem && (isItemCreator || isGroupAdmin),
  );
  const isPending =
    createItem.isPending || updateItem.isPending || updateStatus.isPending || deleteItem.isPending;
  const mutationError = createItem.error ?? updateItem.error ?? updateStatus.error;

  const handleSaveClick = () => {
    if (isPending) return;

    const canPreservePurchasedStatus = editingItem?.status === 'purchased';
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = '물품명을 입력해 주세요.';
    else if (name.trim().length > 100) nextErrors.name = '물품명은 100자 이하로 입력해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (!status && !canPreservePurchasedStatus) {
      nextErrors.status = '현재 상태를 선택해 주세요.';
    }
    if (memo.length > 255) nextErrors.memo = '메모는 255자 이하로 입력해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !category) return;

    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!category) return;
    const numericAssigneeId = buyerId ? Number(buyerId) : undefined;

    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          dto: {
            name: name.trim(),
            category,
            assigneeId: numericAssigneeId ?? null,
            memo: memo.trim() || null,
          },
        });
        if (status && status !== editingItem.status) {
          await updateStatus.mutateAsync({
            id: editingItem.id,
            dto: { status },
          });
        }
      } else {
        if (!status) return;
        await createItem.mutateAsync({
          name: name.trim(),
          category,
          status,
          ...(numericAssigneeId === undefined ? {} : { assigneeId: numericAssigneeId }),
          ...(memo.trim() ? { memo: memo.trim() } : {}),
        });
      }
      setIsSaveModalOpen(false);
      navigate('/items');
    } catch {
      // 실패 시 모달을 열어둔 채 errorMessage로 사유를 보여준다.
    }
  };

  const handleQuickStatusChange = async () => {
    if (!quickItemId || !quickStatus || isPending) return;

    try {
      await updateStatus.mutateAsync({
        id: quickItemId,
        dto: { status: quickStatus },
      });
      navigate('/items');
    } catch {
      // 실패 시 모달을 열어둔 채 errorMessage로 사유를 보여준다.
    }
  };

  const handleDeleteClick = () => {
    if (!canDeleteItem) return;
    deleteItem.reset();
    setIsDeleteModalOpen(true);
  };

  const handleCancelClick = () => {
    if (!isDirty) {
      navigate(-1);
      return;
    }
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    navigate(-1);
  };

  const handleConfirmDelete = async () => {
    if (!editingItem || !canDeleteItem) return;

    try {
      await deleteItem.mutateAsync(editingItem.id);
      setIsDeleteModalOpen(false);
      navigate('/items');
    } catch {
      // 실패 시 모달을 유지해 백엔드 권한/삭제 오류를 표시합니다.
    }
  };

  if (editingItem?.groupId && editingItem.groupId !== groupId) {
    return <Navigate to="/items" replace />;
  }

  return (
    <div className="flex w-full flex-1 bg-white lg:bg-transparent">
      <div className="flex w-full flex-col pb-6 lg:block lg:max-w-[1114px] lg:pb-0">
        <Panel
          title="물품 정보"
          className="h-auto rounded-none bg-transparent p-0 shadow-none lg:min-h-[500px] lg:rounded-[18px] lg:bg-white lg:p-[32px]"
          headerClassName="hidden lg:mb-6 lg:flex"
          titleClassName="text-gray-800"
        >
          <div className="grid gap-4 lg:gap-5">
            <FormInput
              label="물품명"
              required
              placeholder="예: 세제, 샴푸, 두루마리 화장지"
              value={name}
              onChange={event => {
                setName(event.target.value);
                setErrors(previous => ({ ...previous, name: undefined }));
              }}
              maxLength={100}
              error={errors.name}
              containerClassName="gap-2 lg:gap-1"
              labelClassName="text-mobile-body leading-[17px] text-gray-700 lg:text-caption lg:text-gray-800"
              className="h-11 px-4 text-mobile-label lg:h-[50px] lg:text-button"
            />
            <div className="grid grid-cols-2 gap-2 lg:gap-5">
              <SelectDropdown
                label="카테고리"
                required
                value={category}
                onChange={value => {
                  setCategory(value);
                  setErrors(previous => ({ ...previous, category: undefined }));
                }}
                options={ITEM_CATEGORY_OPTIONS}
                placeholder="카테고리 선택"
                error={errors.category}
                containerClassName="gap-2 lg:gap-1"
                labelClassName="text-mobile-body leading-[17px] text-gray-700 lg:text-caption lg:text-gray-800"
                className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
              />
              <SelectDropdown
                label="현재 상태"
                required={editingItem?.status !== 'purchased'}
                value={status}
                onChange={value => {
                  setStatus(value);
                  setErrors(previous => ({ ...previous, status: undefined }));
                }}
                options={ITEM_STATUS_OPTIONS}
                placeholder={
                  editingItem?.status === 'purchased' ? '구매완료 상태 유지' : '상태 선택'
                }
                error={errors.status}
                containerClassName="gap-2 lg:gap-1"
                labelClassName="text-mobile-body leading-[17px] text-gray-700 lg:text-caption lg:text-gray-800"
                className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
              <SelectDropdown
                label="구매 담당자"
                value={buyerId}
                onChange={setBuyerId}
                options={buyerOptions}
                placeholder="미지정"
                containerClassName="gap-2 lg:gap-1"
                labelClassName="text-mobile-body leading-[17px] text-gray-700 lg:text-caption lg:text-gray-800"
                className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
              />
            </div>
            {groupMembersError && (
              <p className="-mt-3 text-xs text-red-500">
                {groupMembersError instanceof Error
                  ? groupMembersError.message
                  : '구매 담당자 목록을 불러오지 못했습니다.'}
              </p>
            )}
            <TextArea
              label="메모"
              placeholder="예: 매달 구매, 마트에서 대용량으로 구입"
              maxLength={255}
              showCount
              rows={3}
              value={memo}
              onChange={event => {
                setMemo(event.target.value);
                setErrors(previous => ({ ...previous, memo: undefined }));
              }}
              error={errors.memo}
              containerClassName="gap-2 lg:gap-1"
              labelClassName="text-mobile-body leading-[17px] text-gray-700 lg:text-caption lg:text-gray-800"
              countClassName="hidden lg:block"
              className="block h-[88px] px-4 py-3.5 text-mobile-label lg:h-[100px] lg:py-4 lg:text-button"
            />
          </div>
        </Panel>

        {mutationError && (
          <p className="mt-4 text-mobile-label text-red-500 lg:text-caption">
            {mutationError instanceof Error ? mutationError.message : '요청을 처리하지 못했습니다.'}
          </p>
        )}

        <div className="mt-5 grid gap-2.5 lg:hidden">
          {editingItem && (
            <ShareMessengerButton
              className="h-11 border-primary-500 text-mobile-body text-primary-500"
              onClick={() => openShare(editingItem.id)}
            />
          )}
          <Button
            type="button"
            className="h-11 w-full bg-primary-700 text-mobile-body font-bold hover:bg-primary-700"
            isLoading={isPending}
            onClick={handleSaveClick}
          >
            {isPending ? '처리 중' : '저장'}
          </Button>
          {canDeleteItem && (
            <Button
              type="button"
              className="h-11 w-full border-0 bg-red-700 text-mobile-body font-bold text-white hover:bg-red-500"
              disabled={isPending}
              onClick={handleDeleteClick}
            >
              삭제
            </Button>
          )}
        </div>

        <FormActions
          className="mt-[30px] hidden lg:flex"
          onSave={handleSaveClick}
          onCancel={handleCancelClick}
          onDelete={canDeleteItem ? handleDeleteClick : undefined}
          saveLabel={isPending ? '처리 중' : '저장'}
          isSubmitting={isPending}
          rightSlot={
            editingItem ? <ShareMessengerButton onClick={() => openShare(editingItem.id)} /> : null
          }
        />

        <Panel
          title="빠른 상태 변경"
          description="목록에서 물품 선택 후 상태만 빠르게 변경할 수 있습니다."
          className="mt-5 rounded-none border-t border-gray-100 bg-transparent px-0 pb-0 pt-5 shadow-none lg:mt-[30px] lg:min-h-[167px] lg:rounded-[18px] lg:border-0 lg:bg-white lg:p-[32px]"
          headerClassName="mb-2 lg:mb-2.5"
          titleClassName="text-mobile-body leading-[17px] text-gray-700 lg:text-body lg:leading-normal lg:text-gray-800"
          descriptionClassName="hidden leading-[17px] lg:block"
        >
          <div className="grid w-full grid-cols-2 gap-2 lg:w-[calc(100%-clamp(0px,calc(60.625vw-776px),97px))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_117px] lg:items-center lg:gap-5">
            <SelectDropdown
              value={quickItemId}
              onChange={setQuickItemId}
              options={items.map(item => ({ value: item.id, label: item.name }))}
              placeholder="물품 선택"
              className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
            />
            <SelectDropdown
              value={quickStatus}
              onChange={setQuickStatus}
              options={ITEM_STATUS_OPTIONS}
              placeholder="상태 선택"
              className="h-11 px-4 text-mobile-label lg:h-[50px] lg:px-3 lg:text-button"
            />
            <Button
              variant="secondary"
              className="col-span-2 mt-3 h-11 w-full border-primary-400 bg-primary-100 text-mobile-body font-bold text-primary-400 hover:bg-primary-200 lg:col-span-1 lg:mt-0 lg:h-[50px] lg:w-[117px] lg:text-button lg:text-primary-500"
              isLoading={updateStatus.isPending}
              onClick={() => void handleQuickStatusChange()}
            >
              변경
            </Button>
          </div>
        </Panel>
      </div>

      <FormCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        icon={<ItemIcon className="size-6" />}
        isPending={isPending}
      />

      <ConfirmModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={() => void handleConfirmSave()}
        icon={<ItemIcon className="size-6" />}
        title={editingItem ? '공용 물품을 수정할까요?' : '공용 물품을 등록할까요?'}
        highlight={name.trim()}
        description={
          editingItem ? '공용 물품 데이터를 수정합니다.' : '내용으로 공용 물품을 등록합니다.'
        }
        confirmLabel={editingItem ? '수정하기' : '저장하기'}
        isPending={isPending}
        errorMessage={mutationError instanceof Error ? mutationError.message : undefined}
        tone={editingItem ? 'edit' : 'default'}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => void handleConfirmDelete()}
        icon={<ItemIcon className="size-6" />}
        title="정말 삭제하시겠어요?"
        highlight={editingItem?.name}
        description="데이터를 삭제합니다. 삭제된 데이터는 복구할 수 없습니다."
        confirmLabel="영구 삭제"
        isPending={deleteItem.isPending}
        errorMessage={
          deleteItem.error instanceof Error
            ? deleteItem.error.message
            : deleteItem.isError
              ? '공용물품 삭제에 실패했습니다. 다시 시도해 주세요.'
              : undefined
        }
        tone="danger"
      />

      <ShareItemPickerModal
        type={activeType}
        options={chatRoomOptions}
        onSelect={handleSelectChatRoom}
        onClose={closeShare}
        isSubmitting={isSharePending}
      />
    </div>
  );
};
