import { UserX } from 'lucide-react';
import { ConfirmActionModal } from '@/features/messenger/components/ConfirmActionModal';
import type { ChatRoomMember } from '@/features/messenger/types';

interface KickMemberModalProps {
  member: ChatRoomMember | null;
  onClose: () => void;
  onConfirm: (member: ChatRoomMember) => void;
}

export const KickMemberModal = ({ member, onClose, onConfirm }: KickMemberModalProps) => {
  return (
    <ConfirmActionModal
      isOpen={!!member}
      onClose={onClose}
      icon={
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-red-100">
          <UserX className="h-[30px] w-[30px] text-red-700" />
        </div>
      }
      title="멤버를 강제 퇴장시킬까요?"
      description={
        <>
          '{member?.name}'님이 채팅방에서 나가게 되며
          <br />
          다시 초대해야 재입장할 수 있어요.
        </>
      }
      primaryLabel="강제 퇴장"
      primaryVariant="danger"
      onPrimary={() => member && onConfirm(member)}
    />
  );
};
