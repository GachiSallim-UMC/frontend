import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/components';

interface MemberItem {
  id: number | string;
  name: string;
  amount?: number;
  isPaid?: boolean;
  isPending?: boolean;
}

interface CheckboxModalProps {
  title: string;
  description?: string;
  members: MemberItem[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedIds: (number | string)[]) => void;
  onReject?: (id: number | string) => void | Promise<void>;
}

export const CheckboxModal = ({
  title,
  description,
  members,
  isOpen,
  onClose,
  onSubmit,
  onReject,
}: CheckboxModalProps) => {
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
  const [rejectingId, setRejectingId] = useState<number | string | null>(null);
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

  useEffect(() => {
    if (!isOpen) {
      setRejectingId(null);
    }
  }, [isOpen]);

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

  const handleReject = async (id: number | string) => {
    if (rejectingId !== null || !onReject) return;

    setRejectingId(id);

    try {
      await onReject(id);
    } finally {
      setRejectingId(null);
    }
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
            const isPending = Boolean(member.isPending);
            const isRejectingThis = rejectingId === member.id;

            return (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isPaid
                    ? 'opacity-50 bg-gray-100 border-gray-100'
                    : isPending
                      ? 'bg-primary-50 border-primary-200'
                      : 'hover:bg-gray-100 border-gray-100'
                }`}
              >
                <label className="flex flex-1 items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaid || selectedIds.includes(member.id)}
                    onChange={() => handleToggle(member.id)}
                    disabled={isPaid}
                    className="w-4 h-4 accent-gray-900 cursor-pointer disabled:cursor-not-allowed"
                  />

                  <span className="font-sans text-button text-gray-800">
                    {member.name}{' '}
                    {member.amount !== undefined &&
                      `(${member.amount.toLocaleString()}원)`}
                    {isPaid && (
                      <span className="ml-2 text-green-600 text-xs">
                        ✓ 완료
                      </span>
                    )}
                    {!isPaid && isPending && (
                      <span className="ml-2 text-primary-600 text-xs">
                        송금완료 표시함
                      </span>
                    )}
                  </span>
                </label>

                {!isPaid && isPending && onReject && (
                  <button
                    type="button"
                    onClick={() => void handleReject(member.id)}
                    disabled={rejectingId !== null}
                    className="ml-2 shrink-0 text-xs text-red-600 underline underline-offset-2 hover:text-red-700 disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                  >
                    {isRejectingThis ? '처리 중...' : '거절'}
                  </button>
                )}
              </div>
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