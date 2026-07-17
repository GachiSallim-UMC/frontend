import { useNavigate, useParams } from 'react-router-dom';
import {
  ITEM_CATEGORY_OPTIONS,
  ITEM_STATUS_OPTIONS,
  useItemForm,
  useQuickItemStatus,
} from '@/features/item';
import { Button, ShareMessengerButton } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import { items, users } from '@/pages/_shared/mockData';

export const ItemFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editingItem = id ? items.find(item => item.id === id) : undefined;

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

  return (
    <>
      <Panel title="물품 정보" className="mt-7 rounded-[18px]">
        <div className="grid gap-4">
          <FormInput
            label="물품명"
            required
            placeholder="예: 화장지"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectDropdown
              label="카테고리"
              required
              value={category}
              onChange={setCategory}
              options={ITEM_CATEGORY_OPTIONS}
              placeholder="카테고리 선택"
            />
            <SelectDropdown
              label="현재 상태"
              required
              value={status}
              onChange={setStatus}
              options={ITEM_STATUS_OPTIONS}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectDropdown
              label="구매 담당자"
              value={buyerId}
              onChange={setBuyerId}
              options={users.map(user => ({ value: user.id, label: user.name }))}
              placeholder="미지정"
            />
          </div>
          <TextArea
            label="메모"
            placeholder="예: 매달 구매, 마트에서 대용량으로 구입"
            rows={3}
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />
        </div>
      </Panel>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => navigate('/items')}>저장</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
        </div>
        <ShareMessengerButton />
      </div>

      <Panel
        title="빠른 상태 변경"
        description="목록에서 물품 선택 후 상태만 빠르게 변경할 수 있습니다."
        className="mt-4 rounded-[18px]"
      >
        <div className="flex flex-wrap items-center gap-3">
          <SelectDropdown
            value={quickItemId}
            onChange={setQuickItemId}
            options={items.map(item => ({ value: item.id, label: item.name }))}
            placeholder="물품 선택"
            className="w-[300px]"
          />
          <SelectDropdown
            value={quickStatus}
            onChange={setQuickStatus}
            options={ITEM_STATUS_OPTIONS}
            placeholder="상태 선택"
            className="w-[300px]"
          />
          <Button
            variant="secondary"
            className="border-primary-500 bg-primary-100 text-primary-600 hover:bg-primary-200"
          >
            변경
          </Button>
        </div>
      </Panel>
    </>
  );
};
