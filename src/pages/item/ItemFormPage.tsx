import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ITEM_CATEGORY_OPTIONS,
  ITEM_STATUS_OPTIONS,
  useCreateItem,
  useItemForm,
  useItems,
  useQuickItemStatus,
  useUpdateItem,
  useUpdateItemStatus,
  type Item,
} from '@/features/item';
import { useGroupMembers } from '@/features/member';
import { Button, FormActions } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import { useGroupStore } from '@/shared/store';

type FormErrors = Partial<Record<'name' | 'category' | 'status', string>>;

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
  } = useItemForm(editingItem);
  const {
    itemId: quickItemId,
    setItemId: setQuickItemId,
    status: quickStatus,
    setStatus: setQuickStatus,
  } = useQuickItemStatus();
  const { data: groupMembers, error: groupMembersError } = useGroupMembers(groupId);
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const updateStatus = useUpdateItemStatus();
  const [errors, setErrors] = useState<FormErrors>({});

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

  const isPending = createItem.isPending || updateItem.isPending || updateStatus.isPending;
  const mutationError = createItem.error ?? updateItem.error ?? updateStatus.error;

  const handleSave = async () => {
    if (isPending) return;

    const canPreservePurchasedStatus = editingItem?.status === 'purchased';
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = '물품명을 입력해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (!status && !canPreservePurchasedStatus) {
      nextErrors.status = '현재 상태를 선택해 주세요.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !category) return;

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
      navigate('/items');
    } catch {
      // mutationError를 폼 하단에 표시한다.
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
      // mutationError를 폼 하단에 표시한다.
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-[1114px] min-[1440px]:w-[calc(100%-18px)] min-[1440px]:max-w-none">
      <Panel
        title="물품 정보"
        className="h-[500px] overflow-hidden rounded-[18px] p-[30px] shadow-none"
        headerClassName="mb-5"
        titleClassName="text-gray-800"
      >
        <div className="grid gap-5">
          <FormInput
            label="물품명"
            required
            placeholder="예: 화장지"
            value={name}
            onChange={event => setName(event.target.value)}
            error={errors.name}
            containerClassName="gap-1"
            labelClassName="leading-[17px] text-gray-800"
            className="px-4"
          />
          <div className="grid grid-cols-2 gap-5">
            <SelectDropdown
              label="카테고리"
              required
              value={category}
              onChange={setCategory}
              options={ITEM_CATEGORY_OPTIONS}
              placeholder="카테고리 선택"
              error={errors.category}
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
            />
            <SelectDropdown
              label="현재 상태"
              required={editingItem?.status !== 'purchased'}
              value={status}
              onChange={setStatus}
              options={ITEM_STATUS_OPTIONS}
              placeholder={editingItem?.status === 'purchased' ? '구매완료 상태 유지' : '상태 선택'}
              error={errors.status}
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <SelectDropdown
              label="구매 담당자"
              value={buyerId}
              onChange={setBuyerId}
              options={buyerOptions}
              placeholder="미지정"
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
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
            onChange={event => setMemo(event.target.value)}
            containerClassName="gap-1"
            labelClassName="leading-[17px] text-gray-800"
            className="block h-[100px] px-4 py-4"
          />
        </div>
      </Panel>

      {mutationError && (
        <p className="mt-4 text-caption text-red-500">
          {mutationError instanceof Error ? mutationError.message : '요청을 처리하지 못했습니다.'}
        </p>
      )}

      <FormActions
        className="mt-[30px]"
        onSave={() => void handleSave()}
        onCancel={() => navigate(-1)}
        saveLabel={isPending ? '처리 중' : '저장'}
      />

      <Panel
        title="빠른 상태 변경"
        description="목록에서 물품 선택 후 상태만 빠르게 변경할 수 있습니다."
        className="mt-[30px] h-[167px] overflow-hidden rounded-[18px] p-[30px] shadow-none"
        headerClassName="mb-2.5"
        titleClassName="text-gray-800"
        descriptionClassName="leading-[17px]"
      >
        <div className="grid w-[calc(100%-clamp(0px,calc(60.625vw-776px),97px))] grid-cols-[minmax(0,1fr)_minmax(0,1fr)_117px] items-center gap-5">
          <SelectDropdown
            value={quickItemId}
            onChange={setQuickItemId}
            options={items.map(item => ({ value: item.id, label: item.name }))}
            placeholder="물품 선택"
          />
          <SelectDropdown
            value={quickStatus}
            onChange={setQuickStatus}
            options={ITEM_STATUS_OPTIONS}
            placeholder="상태 선택"
          />
          <Button
            variant="secondary"
            className="h-[50px] w-[117px] border-primary-500 bg-primary-100 font-bold text-primary-500 hover:bg-primary-200"
            isLoading={updateStatus.isPending}
            onClick={() => void handleQuickStatusChange()}
          >
            변경
          </Button>
        </div>
      </Panel>
    </div>
  );
};
