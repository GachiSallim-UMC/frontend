import { useState, useEffect } from 'react';
import { Modal } from '@/shared/components';

interface MemberItem {
  id: number | string;
  name: string;
  amount?: number;
  isPaid?: boolean;
}

interface CheckboxModalProps {
  title: string;
  description?: string;
  members: MemberItem[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedIds: (number | string)[]) => void;
}

export const CheckboxModal = ({
  title,
  description,
  members,
  isOpen,
  onClose,
  onSubmit,
}: CheckboxModalProps) => {
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

  
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([]);
    }
  }, [isOpen]);

  const handleToggle = (id: number | string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {description && <p className="text-xs text-gray-500 -mt-2">{description}</p>}

        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
          {members.map((member) => (
            <label
              key={member.id}
              className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 transition-colors ${
                member.isPaid
                  ? 'opacity-50 cursor-not-allowed bg-gray-50'
                  : 'hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <span className="font-sans text-button text-gray-800">
                {member.name} {member.amount !== undefined && `(${member.amount.toLocaleString()}원)`}
                {member.isPaid && <span className="ml-2 text-green-600 text-xs">✓ 완료</span>}
              </span>
              <input
                type="checkbox"
                checked={selectedIds.includes(member.id)}
                onChange={() => handleToggle(member.id)}
                disabled={member.isPaid}
                className="w-4 h-4 accent-gray-900 cursor-pointer disabled:cursor-not-allowed"
              />
            </label>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-sans text-button font-bold hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              onSubmit(selectedIds);
              onClose(); 
            }}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white font-sans text-button font-bold hover:bg-black transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>
    </Modal>
  );
};