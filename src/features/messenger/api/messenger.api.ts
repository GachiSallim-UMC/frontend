import { apiClient } from '@/shared/api';
import type {
  ChatRoomDetailResponse,
  ChatRoomListItemResponse,
  CreateCardMessageRequest,
  CreateChatRoomRequest,
  CreateMessageRequest,
  InviteMemberRequest,
  ListMessagesQuery,
  MessageResponse,
  TransferOwnerRequest,
  UpdateChatRoomMemberSettingsRequest,
} from '@/features/messenger/types';

const BASE = '/chat-rooms';

export const messengerApi = {
  /** 그룹의 채팅방 목록 */
  getChatRooms: async (groupId: string): Promise<ChatRoomListItemResponse[]> => {
    const { data } = await apiClient.get<ChatRoomListItemResponse[]>(BASE, { params: { groupId } });
    return Array.isArray(data) ? data : [];
  },

  /** 채팅방 상세 (멤버 목록 포함) */
  getChatRoomDetail: async (roomId: string): Promise<ChatRoomDetailResponse> => {
    const { data } = await apiClient.get<ChatRoomDetailResponse>(`${BASE}/${roomId}`);
    return data;
  },

  createChatRoom: async (dto: CreateChatRoomRequest): Promise<ChatRoomDetailResponse> => {
    const { data } = await apiClient.post<ChatRoomDetailResponse>(BASE, dto);
    return data;
  },

  deleteChatRoom: async (roomId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${roomId}`);
  },

  inviteMembers: async (roomId: string, dto: InviteMemberRequest): Promise<void> => {
    await apiClient.post(`${BASE}/${roomId}/members`, dto);
  },

  /** 본인이 호출하면 나가기, 방장이 다른 멤버에 호출하면 강퇴 — 같은 엔드포인트 */
  removeMember: async (roomId: string, userId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${roomId}/members/${userId}`);
  },

  /** 방장 위임 */
  transferOwner: async (roomId: string, dto: TransferOwnerRequest): Promise<void> => {
    await apiClient.patch(`${BASE}/${roomId}/owner`, dto);
  },

  /** 내 알림/상단고정 설정 변경 */
  updateMemberSettings: async (roomId: string, dto: UpdateChatRoomMemberSettingsRequest): Promise<void> => {
    await apiClient.patch(`${BASE}/${roomId}/members/me`, dto);
  },

  getMessages: async (roomId: string, query?: ListMessagesQuery): Promise<MessageResponse[]> => {
    const { data } = await apiClient.get<MessageResponse[]>(`${BASE}/${roomId}/messages`, { params: query });
    return Array.isArray(data) ? data : [];
  },

  sendMessage: async (roomId: string, dto: CreateMessageRequest): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>(`${BASE}/${roomId}/messages`, dto);
    return data;
  },

  sendCardMessage: async (roomId: string, dto: CreateCardMessageRequest): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>(`${BASE}/${roomId}/messages/card`, dto);
    return data;
  },

  markAsRead: async (roomId: string): Promise<void> => {
    await apiClient.patch(`${BASE}/${roomId}/read`);
  },
};
