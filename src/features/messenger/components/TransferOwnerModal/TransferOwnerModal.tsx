import { Crown } from 'lucide-react';
import { ConfirmActionModal } from '@/features/messenger/components/ConfirmActionModal';
import type { ChatRoomMember } from '@/features/messenger/types';

interface TransferOwnerModalProps {
  member: ChatRoomMember | null;
  onClose: () => void;
  onConfirm: (member: ChatRoomMember) => void;
}

export const TransferOwnerModal = ({ member, onClose, onConfirm }: TransferOwnerModalProps) => {
  return (
    <ConfirmActionModal
      isOpen={!!member}
      onClose={onClose}
      icon={
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-orange-100">
          <Crown className="h-9 w-9 text-orange-500" />
        </div>
      }
      title="방장을 위임할까요?"
      description={
        <>
          '{member?.name}'님에게 방장 권한을 넘기고
          <br />
          회원님은 일반 멤버가 됩니다.
        </>
      }
      primaryLabel="위임하기"
      onPrimary={() => member && onConfirm(member)}
    />
  );
};
