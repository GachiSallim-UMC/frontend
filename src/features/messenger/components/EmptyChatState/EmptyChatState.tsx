import { Plus } from 'lucide-react';
import { ConnectionStatusBadge } from '@/features/messenger/components/ConnectionStatusBadge';
import emptyChatIllustration from '@/assets/icons/messenger/empty-chat.png';

interface EmptyChatStateProps {
  onCreateRoom: () => void;
  isConnected?: boolean;
}

export const EmptyChatState = ({ onCreateRoom, isConnected = true }: EmptyChatStateProps) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col border-l border-gray-100 bg-primary-50">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
        <h2 className="text-[20px] font-semibold leading-[normal] text-gray-900">메신저</h2>
        <ConnectionStatusBadge isConnected={isConnected} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-7">
        <img src={emptyChatIllustration} alt="" className="h-[186px] w-[249px]" />
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-[22px] font-bold leading-[normal] text-gray-900">아직 채팅방이 없어요</h3>
          <p className="text-[14px] font-medium leading-[normal] text-gray-600">
            첫 채팅방을 만들어 룸메이트와 집안일, 정산,
            <br />
            물품 이야기를 나눠보세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCreateRoom()}
          className="flex h-[50px] w-[240px] items-center justify-center gap-1 rounded-lg bg-primary-600 text-[16px] font-normal leading-[normal] text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-6 w-6" />
          새 채팅방 만들기
        </button>
      </div>
    </div>
  );
};
