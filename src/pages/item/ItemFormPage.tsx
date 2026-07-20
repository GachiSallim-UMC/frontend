import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ITEM_CATEGORY_OPTIONS,
  ITEM_STATUS_OPTIONS,
  useItemForm,
  useQuickItemStatus,
} from '@/features/item';
import { Button, FormActions } from '@/shared/components/ui';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { Panel } from '@/shared/components/layout';
import { items, users } from '@/pages/_shared/mockData';

type FormErrors = Partial<Record<'name' | 'category' | 'status', string>>;

export const ItemFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editingItem = id ? items.find(item => item.id === id) : undefined;
  const notFound = Boolean(id) && !editingItem;

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
  const [errors, setErrors] = useState<FormErrors>({});

  if (notFound) {
    return <Navigate to="/items" replace />;
  }

  const handleSave = () => {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = '물품명을 입력해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (!status) nextErrors.status = '현재 상태를 선택해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    navigate('/items');
  };

  const handleQuickStatusChange = () => {
    if (!quickItemId || !quickStatus) return;
    // 실제 상태 변경 API가 아직 없어 목데이터라 반영은 안 되지만, 선택값 검증 후
    // 목록으로 돌아가는 흐름은 저장 버튼과 동일하게 맞춰둔다.
    navigate('/items');
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
            onChange={e => setName(e.target.value)}
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
              required
              value={status}
              onChange={setStatus}
              options={ITEM_STATUS_OPTIONS}
              placeholder="상태 선택"
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
              options={users.map(user => ({ value: user.id, label: user.name }))}
              placeholder="미지정"
              containerClassName="gap-1"
              labelClassName="leading-[17px] text-gray-800"
            />
          </div>
          <TextArea
            label="메모"
            placeholder="예: 매달 구매, 마트에서 대용량으로 구입"
            rows={3}
            value={memo}
            onChange={e => setMemo(e.target.value)}
            containerClassName="gap-1"
            labelClassName="leading-[17px] text-gray-800"
            className="block h-[100px] px-4 py-4"
          />
        </div>
      </Panel>

      <FormActions className="mt-[30px]" onSave={handleSave} onCancel={() => navigate(-1)} />

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
            onClick={handleQuickStatusChange}
          >
            변경
          </Button>
        </div>
      </Panel>
    </div>
  );
};
