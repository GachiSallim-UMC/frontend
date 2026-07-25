import { useEffect, useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { MemberInviteRow } from '@/features/messenger/components/MemberCheckRow';
import type { ChatRoomMember } from '@/features/messenger/types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 아직 채팅방에 없는, 초대 가능한 멤버 목록 */
  candidateMembers: ChatRoomMember[];
  onInvite: (memberIds: string[]) => void;
}

export const InviteMemberModal = ({ isOpen, onClose, candidateMembers, onInvite }: InviteMemberModalProps) => {
  const [memberIds, setMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) setMemberIds([]);
  }, [isOpen]);

  const toggleMember = (id: string) => {
    setMemberIds(prev => (prev.includes(id) ? prev.filter(memberId => memberId !== id) : [...prev, id]));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="멤버 초대" className="max-w-[500px] rounded-[28px]">
      {candidateMembers.length === 0 ? (
        <p className="py-6 text-center text-[14px] font-normal leading-[normal] text-gray-500">
          초대할 수 있는 멤버가 없습니다.
        </p>
      ) : (
        <div className="flex max-h-[360px] flex-col divide-y divide-gray-100 overflow-y-auto">
          {candidateMembers.map(member => (
            <MemberInviteRow
              key={member.id}
              name={member.name}
              avatarUrl={member.avatarUrl}
              selected={memberIds.includes(member.id)}
              onToggle={() => toggleMember(member.id)}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => memberIds.length > 0 && onInvite(memberIds)}
        disabled={memberIds.length === 0}
        className="mt-4 h-[58px] w-full rounded-lg bg-primary-600 text-[16px] font-bold leading-[normal] text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        초대하기
      </button>
    </Modal>
  );
};
