import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertStore, useGroupStore } from '@/shared/store';
import type { ShareableOption, ShareCardType } from '@/features/messenger/types';
import { CARD_TYPE_BY_SHARE_TYPE } from '@/features/messenger/hooks/messenger.mappers';
import { useChatRooms } from '@/features/messenger/hooks/useChatRoomQueries';
import { useSendCardMessage } from '@/features/messenger/hooks/useChatRoomMutations';

/** 도메인(집안일/정산/물품/규칙) 공통 "메신저에 공유" 흐름 — 방 선택 모달 오픈부터 카드 전송까지 */
export const useShareToMessenger = (type: ShareCardType) => {
  const navigate = useNavigate();
  const groupId = useGroupStore(s => s.selectedGroupId);
  const { data: rooms } = useChatRooms(groupId);
  const sendCardMessageMutation = useSendCardMessage(groupId);
  const [refId, setRefId] = useState<string | null>(null);
  // isPending은 렌더링 이후에야 갱신되므로, 같은 틱 안에서 연속 클릭되는 경우까지 막으려면
  // 리렌더를 기다리지 않는 동기 락이 따로 필요하다.
  const isSubmittingRef = useRef(false);

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
    if (!refId || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    sendCardMessageMutation.mutate(
      { roomId, type: CARD_TYPE_BY_SHARE_TYPE[type], refId },
      {
        onSuccess: () => {
          isSubmittingRef.current = false;
          setRefId(null);
          navigate('/messenger', { state: { roomId } });
        },
        // 전역 에러 모달은 4xx 대부분을 걸러내므로(isUnexpectedApiError), 공유 실패는 여기서 직접 안내한다.
        onError: error => {
          isSubmittingRef.current = false;
          useAlertStore.getState().showAlert({
            title: '오류',
            message: error instanceof Error ? error.message : '메신저 공유에 실패했습니다. 잠시 후 다시 시도해 주세요.',
          });
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
