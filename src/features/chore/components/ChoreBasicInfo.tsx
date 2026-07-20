import { useState } from 'react';
import { FormInput, SelectDropdown } from '@/shared/components';
import type { ChoreCategory } from '../types/chore.types';
import { users } from '@/pages/_shared/mockData';
import { CATEGORY_OPTIONS } from '../constants/chore.constants';

export const ChoreBasicInfo = () => {
  const [choreName, setChoreName] = useState('');
  const [assignee, setAssignee] = useState('');
  const [category, setCategory] = useState<ChoreCategory | ''>('');

  const assigneeOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <section className="flex w-full flex-col rounded-2xl bg-white p-[32px]">
      <h2 className="mb-[24px] text-[18px] font-bold text-gray-800">기본 정보</h2>

      <div className="flex flex-col gap-[20px]">
        <FormInput
          label="집안일 이름"
          placeholder="예: 화장실 청소, 설거지, 분리수거"
          value={choreName}
          onChange={e => setChoreName(e.target.value)}
        />

        <div className="flex w-full gap-[20px]">
          <div className="flex-1">
            <SelectDropdown
              label="담당자"
              required
              placeholder="담당자 선택"
              options={assigneeOptions}
              value={assignee}
              onChange={setAssignee}
            />
          </div>

          <div className="flex-1">
            <SelectDropdown<ChoreCategory>
              label="카테고리"
              placeholder="카테고리를 선택해 주세요"
              options={CATEGORY_OPTIONS as { value: ChoreCategory; label: string }[]}
              value={category}
              onChange={setCategory}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
