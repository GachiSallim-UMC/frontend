import { useEffect, useState } from 'react';
import { ConfirmActionModal } from '@/features/messenger/components/ConfirmActionModal';
import DeleteTrashIcon from '@/assets/icons/messenger/delete-trash.svg?react';

interface DeleteChatRoomModalProps {
  isOpen: boolean;
  roomName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteChatRoomModal = ({ isOpen, roomName, onClose, onConfirm }: DeleteChatRoomModalProps) => {
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (isOpen) setConfirmText('');
  }, [isOpen]);

  return (
    <ConfirmActionModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<DeleteTrashIcon className="h-[72px] w-[72px]" />}
      title="채팅방을 삭제할까요?"
      description={
        <>
          '{roomName}'의 대화 내용과
          <br />
          공유된 정산·물품 기록이 모두 사라집니다.
        </>
      }
      primaryLabel="영구 삭제"
      primaryVariant="danger"
      primaryDisabled={confirmText !== roomName}
      onPrimary={onConfirm}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="delete-room-confirm" className="text-[18px] font-bold leading-[normal] text-gray-800">
          확인을 위해 채팅방 이름을 입력해주세요.
        </label>
        <input
          id="delete-room-confirm"
          type="text"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder={roomName}
          className="h-[58px] w-full rounded-lg border border-gray-100 px-[21px] text-[16px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-[14px] font-medium leading-[normal] text-gray-400">
          문구가 정확히 일치해야 탈퇴 버튼이 활성화돼요.
        </p>
      </div>
    </ConfirmActionModal>
  );
};
