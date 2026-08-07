import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { ChatFilterChips } from '@/features/messenger/components/ChatFilterChips';
import { MemberInviteRow } from '@/features/messenger/components/MemberCheckRow';
import type { ChatRoomCategory, ChatRoomMember } from '@/features/messenger/types';

interface CreateChatRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; avatarUrl?: string };
  /** 현재 사용자를 제외한 초대 가능 멤버 목록 */
  candidateMembers: ChatRoomMember[];
  onCreate: (data: { name: string; category: ChatRoomCategory; memberIds: string[] }) => void;
  /** 검색 결과 없음 화면에서 넘어올 때 미리 채워줄 채팅방 이름 */
  initialName?: string;
}

const CATEGORY_OPTIONS: { value: ChatRoomCategory; label: string }[] = [
  { value: 'group', label: '그룹' },
  { value: 'notice', label: '공지' },
  { value: 'dm', label: '1:1' },
];

export const CreateChatRoomModal = ({
  isOpen,
  onClose,
  currentUser,
  candidateMembers,
  onCreate,
  initialName = '',
}: CreateChatRoomModalProps) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string>();
  const [category, setCategory] = useState<ChatRoomCategory>('group');
  const [memberIds, setMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setNameError(undefined);
      setCategory('group');
      setMemberIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggleMember = (id: string) => {
    setMemberIds(prev => (prev.includes(id) ? prev.filter(memberId => memberId !== id) : [...prev, id]));
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('채팅방 이름을 입력해 주세요.');
      return;
    }
    if (trimmedName.length > 100) {
      setNameError('채팅방 이름은 100자 이하로 입력해 주세요.');
      return;
    }
    onCreate({ name: trimmedName, category, memberIds });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
      closeOnOverlayClick
      className="max-w-[500px] rounded-[28px] p-0"
    >
      <div className="flex h-[78px] shrink-0 items-center gap-2 border-b border-gray-100 px-[30px]">
        <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-900">
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <h2 className="text-[20px] font-bold leading-[normal] tracking-[0.8px] text-gray-900">새 채팅방 만들기</h2>
      </div>

      <div className="flex flex-col gap-6 px-10 pt-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="new-room-name" className="text-[16px] font-bold leading-[normal] text-gray-800">
            채팅방 이름
          </label>
          <input
            id="new-room-name"
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setNameError(undefined);
            }}
            maxLength={100}
            placeholder="채팅방 이름"
            className={`h-[58px] w-full rounded-lg border px-[21px] text-[16px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${nameError ? 'border-red-500' : 'border-gray-100'}`}
          />
          {nameError && <p className="text-xs text-red-500">{nameError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[16px] font-bold leading-[normal] text-gray-800">채팅방 유형</span>
          <ChatFilterChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[16px] font-bold leading-[normal] text-gray-800">멤버 초대</span>
          <div className="flex max-h-[240px] flex-col divide-y divide-gray-100 overflow-y-auto">
            <MemberInviteRow
              name={currentUser.name}
              avatarUrl={currentUser.avatarUrl}
              selected
              onToggle={() => {}}
              trailingLabel="나"
            />
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
        </div>
      </div>

      <div className="mt-6 flex items-center gap-5 border-t border-gray-100 px-10 py-[26px]">
        <button
          type="button"
          onClick={handleCreate}
          disabled={!name.trim() || name.trim().length > 100}
          className="h-[58px] flex-1 rounded-lg bg-primary-600 text-[16px] font-bold leading-[normal] text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          채팅방 만들기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-[58px] w-[140px] shrink-0 rounded-lg bg-gray-200 text-[16px] font-bold leading-[normal] text-white transition-colors hover:bg-gray-200/80"
        >
          취소
        </button>
      </div>
    </Modal>
  );
};
