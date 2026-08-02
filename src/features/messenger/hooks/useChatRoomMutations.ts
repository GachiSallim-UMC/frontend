import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messengerApi } from '@/features/messenger/api/messenger.api';
import type { CardMessageTypeDto, ChatRoomCategory } from '@/features/messenger/types';
import { mapCategoryToChatRoomType } from './messenger.mappers';
import { MESSENGER_QUERY_KEYS } from './useChatRoomQueries';

/** 채팅방 생성 */
export const useCreateChatRoom = (groupId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, category }: { name: string; category: ChatRoomCategory }) =>
      messengerApi.createChatRoom({ groupId: groupId as string, name, type: mapCategoryToChatRoomType(category) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.rooms(groupId) });
    },
  });
};

/** 채팅방 삭제 (방장만 가능) */
export const useDeleteChatRoom = (groupId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => messengerApi.deleteChatRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.rooms(groupId) });
    },
  });
};

/** 멤버 초대 */
export const useInviteMembers = (groupId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, userIds }: { roomId: string; userIds: string[] }) =>
      messengerApi.inviteMembers(roomId, { userIds }),
    onSuccess: (_data, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.roomDetail(roomId) });
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.rooms(groupId) });
    },
  });
};

/** 멤버 제거 — 본인 호출 시 나가기, 방장이 타인 대상 호출 시 강퇴 */
export const useRemoveMember = (groupId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) => messengerApi.removeMember(roomId, userId),
    onSuccess: (_data, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.roomDetail(roomId) });
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.rooms(groupId) });
    },
  });
};

/** 방장 위임 — 백엔드에 추가 요청해둔 엔드포인트 */
export const useTransferOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      messengerApi.transferOwner(roomId, { userId }),
    onSuccess: (_data, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.roomDetail(roomId) });
    },
  });
};

/** 텍스트 메시지 전송 — 실패 시 말풍선 옆에 인라인으로 보여주므로 전역 에러 모달은 건너뜀 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, content }: { roomId: string; content: string }) =>
      messengerApi.sendMessage(roomId, { content }),
    onSuccess: (_data, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.messages(roomId) });
    },
    meta: { skipGlobalError: true },
  });
};

/** 카드(공유) 메시지 전송 */
export const useSendCardMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, type, refId, content }: { roomId: string; type: CardMessageTypeDto; refId: string; content?: string }) =>
      messengerApi.sendCardMessage(roomId, { type, refId, content }),
    onSuccess: (_data, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.messages(roomId) });
    },
  });
};

/** 내 알림/상단고정 설정 변경 */
export const useUpdateMemberSettings = (groupId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      notificationEnabled,
      isPinned,
    }: {
      roomId: string;
      notificationEnabled?: boolean;
      isPinned?: boolean;
    }) => messengerApi.updateMemberSettings(roomId, { notificationEnabled, isPinned }),
    onSuccess: (_data, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.roomDetail(roomId) });
      // 상단 고정은 방 목록 정렬에 쓰이므로 목록 쿼리도 같이 갱신한다
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.rooms(groupId) });
    },
  });
};

/** 읽음 처리 */
export const useMarkAsRead = (groupId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => messengerApi.markAsRead(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_QUERY_KEYS.rooms(groupId) });
    },
  });
};
