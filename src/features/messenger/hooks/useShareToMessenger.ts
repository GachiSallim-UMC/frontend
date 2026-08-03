import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupStore } from '@/shared/store';
import type { ShareableOption, ShareCardType } from '@/features/messenger/types';
import { CARD_TYPE_BY_SHARE_TYPE } from './messenger.mappers';
import { useChatRooms } from './useChatRoomQueries';
import { useSendCardMessage } from './useChatRoomMutations';

/** 도메인(집안일/정산/물품/규칙) 공통 "메신저에 공유" 흐름 — 방 선택 모달 오픈부터 카드 전송까지 */
export const useShareToMessenger = (type: ShareCardType) => {
  const navigate = useNavigate();
  const groupId = useGroupStore(s => s.selectedGroupId);
  const { data: rooms } = useChatRooms(groupId);
  const sendCardMessageMutation = useSendCardMessage(groupId);
  const [refId, setRefId] = useState<string | null>(null);

  const chatRoomOptions: ShareableOption[] = useMemo(
    () =>
      rooms.map(room => ({
        id: room.id,
        title: room.name,
        subtitle: room.category === 'group' ? '그룹 채팅방' : room.category === 'notice' ? '공지방' : '1:1 채팅방',
      })),
    [rooms],
  );

  const openShare = (targetRefId: string) => setRefId(targetRefId);
  const closeShare = () => setRefId(null);

  const handleSelectChatRoom = (roomId: string) => {
    if (!refId) return;

    sendCardMessageMutation.mutate(
      { roomId, type: CARD_TYPE_BY_SHARE_TYPE[type], refId },
      {
        onSuccess: () => {
          setRefId(null);
          navigate('/messenger', { state: { roomId } });
        },
      },
    );
  };

  return {
    activeType: refId !== null ? type : null,
    chatRoomOptions,
    openShare,
    closeShare,
    handleSelectChatRoom,
    isSharePending: sendCardMessageMutation.isPending,
  };
};
