import { useParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { FormInput, SelectDropdown } from '@/shared/components/form';
import { PageHeading, Panel } from '@/shared/components/layout';
import { users } from '@/pages/_shared/mockData';

const categoryOptions = [
  { value: 'kitchen', label: '주방' },
  { value: 'bathroom', label: '욕실' },
  { value: 'cleaning', label: '청소' },
  { value: 'etc', label: '기타' },
] as const;

const statusOptions = [
  { value: 'enough', label: '충분' },
  { value: 'short', label: '부족' },
  { value: 'empty', label: '소진' },
] as const;

export const ItemFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <>
      <PageHeading
        title={isEdit ? '물품 수정' : '물품 등록'}
        description="공용 물품 상태와 구매 담당자를 정리합니다."
      />

      <Panel title="물품 정보" className="max-w-[640px]">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormInput label="물품명" placeholder="예: 화장지" required />
          </div>
          <SelectDropdown
            label="카테고리"
            value=""
            onChange={() => undefined}
            options={[...categoryOptions]}
            placeholder="카테고리 선택"
            required
          />
          <SelectDropdown
            label="상태"
            value="short"
            onChange={() => undefined}
            options={[...statusOptions]}
            required
          />
          <div className="col-span-2">
            <SelectDropdown
              label="구매 담당자"
              value=""
              onChange={() => undefined}
              options={users.map(user => ({ value: user.id, label: user.name }))}
              placeholder="담당자 선택"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary">취소</Button>
          <Button>{isEdit ? '수정 완료' : '등록하기'}</Button>
        </div>
      </Panel>
    </>
  );
};
