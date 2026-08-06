import { useState, useEffect, useRef } from 'react';
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
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setSelectedIds(
        members
          .filter((member) => member.isPaid)
          .map((member) => member.id)
      );
    }
    wasOpen.current = isOpen;
  }, [isOpen, members]);

  const handleToggle = (id: number | string) => {
    const member = members.find((item) => item.id === id);

    if (member?.isPaid) {
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const unpaidSelectedIds = selectedIds.filter((id) => {
      const member = members.find((item) => item.id === id);
      return !member?.isPaid;
    });

    onSubmit(unpaidSelectedIds);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {description && (
          <p className="text-xs text-gray-500 -mt-2">
            {description}
          </p>
        )}

        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
          {members.map((member) => {
            const isPaid = Boolean(member.isPaid);

            return (
              <label
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 transition-colors ${
                  isPaid
                    ? 'opacity-50 cursor-not-allowed bg-gray-100'
                    : 'hover:bg-gray-100 cursor-pointer'
                }`}
              >
                <span className="font-sans text-button text-gray-800">
                  {member.name}{' '}
                  {member.amount !== undefined &&
                    `(${member.amount.toLocaleString()}원)`}
                  {isPaid && (
                    <span className="ml-2 text-green-600 text-xs">
                      ✓ 완료
                    </span>
                  )}
                </span>

                <input
                  type="checkbox"
                  checked={isPaid || selectedIds.includes(member.id)}
                  onChange={() => handleToggle(member.id)}
                  disabled={isPaid}
                  className="w-4 h-4 accent-gray-900 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>
            );
          })}
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
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white font-sans text-button font-bold hover:bg-black transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>
    </Modal>
  );
};