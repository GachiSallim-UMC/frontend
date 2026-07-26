import { useEffect, useState } from 'react';
import { ConfirmActionModal } from '@/features/messenger/components/ConfirmActionModal';
import DelegateCrownIcon from '@/assets/icons/messenger/delegate-crown.svg?react';
import { MemberCheckRow } from '@/features/messenger/components/MemberCheckRow';
import type { ChatRoomMember } from '@/features/messenger/types';

interface DelegateOwnerModalProps {
  isOpen: boolean;
  candidates: ChatRoomMember[];
  onClose: () => void;
  onConfirm: (newOwnerId: string) => void;
}

export const DelegateOwnerModal = ({ isOpen, candidates, onClose, onConfirm }: DelegateOwnerModalProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setSelectedId(null);
  }, [isOpen]);

  return (
    <ConfirmActionModal
      isOpen={isOpen}
      onClose={onClose}
      icon={
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-orange-100">
          <DelegateCrownIcon className="h-9 w-auto" />
        </div>
      }
      title="방장을 위임해주세요"
      description={
        <>
          회원님은 이 채팅방의 방장입니다.
          <br />
          나가기 전에 다른 멤버에게 방장을 넘겨주세요.
        </>
      }
      primaryLabel="위임하고 나가기"
      primaryVariant="danger"
      primaryDisabled={!selectedId}
      onPrimary={() => selectedId && onConfirm(selectedId)}
      contentBottomClassName="pb-6"
    >
      <div className="flex flex-col gap-2">
        <p className="text-[18px] font-bold leading-[normal] text-gray-800">새 방장 선택</p>
        <div className="flex flex-col gap-2">
          {candidates.map(member => (
            <MemberCheckRow
              key={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              selected={selectedId === member.id}
              onToggle={() => setSelectedId(member.id)}
            />
          ))}
        </div>
      </div>
    </ConfirmActionModal>
  );
};
