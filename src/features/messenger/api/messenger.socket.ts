import { useAuthStore } from '@/shared/store';
import type { ChatSocketServerEvent, MessageResponse } from '@/features/messenger/types';

const WS_URL = import.meta.env.VITE_WS_URL as string | undefined;
const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30_000;

export type ChatSocketStatus = 'connecting' | 'open' | 'reconnecting';

interface ChatSocketHandlers {
  onStatusChange: (status: ChatSocketStatus) => void;
  onMessageNew: (data: MessageResponse) => void;
  onRoomJoinError: (message: string) => void;
}

/**
 * API Gateway WebSocket 저수준 연결 관리자. React와 무관 — useChatSocket 훅에서만 사용.
 * VITE_WS_URL이 없으면(백엔드 엔드포인트 미전달) connect()가 완전히 no-op.
 */
export class ChatSocketConnection {
  private socket: WebSocket | null = null;
  private desiredRoomId: string | null = null;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionallyClosed = false;

  constructor(private handlers: ChatSocketHandlers) {}

  connect(): void {
    if (!WS_URL) return;
    this.intentionallyClosed = false;
    this.open();
  }

  private open(): void {
    if (this.intentionallyClosed) return;
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      this.scheduleReconnect();
      return;
    }

    this.handlers.onStatusChange(this.reconnectAttempt > 0 ? 'reconnecting' : 'connecting');

    const socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.handlers.onStatusChange('open');
      if (this.desiredRoomId) this.sendJoin(this.desiredRoomId);
    };

    socket.onclose = () => {
      this.socket = null;
      if (this.intentionallyClosed) return;
      this.handlers.onStatusChange('reconnecting');
      this.scheduleReconnect();
    };

    socket.onmessage = event => this.handleMessage(event);
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay =
      this.reconnectAttempt === 0 ? 0 : Math.min(BASE_BACKOFF_MS * 2 ** (this.reconnectAttempt - 1), MAX_BACKOFF_MS);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => this.open(), delay);
  }

  private handleMessage(event: MessageEvent): void {
    let parsed: ChatSocketServerEvent;
    try {
      parsed = JSON.parse(event.data);
    } catch {
      return;
    }
    if (parsed.event === 'message:new') {
      this.handlers.onMessageNew(parsed.data);
    } else if (parsed.event === 'room:join:error') {
      this.handlers.onRoomJoinError(parsed.data.message);
    }
    // room:joined / room:left: roomJoin/roomLeave를 성공으로 낙관적 처리 중이라 반응 불필요.
  }

  private send(action: 'roomJoin' | 'roomLeave', chatRoomId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action, chatRoomId }));
    }
  }

  private sendJoin(chatRoomId: string): void {
    this.send('roomJoin', chatRoomId);
  }

  private sendLeave(chatRoomId: string): void {
    this.send('roomLeave', chatRoomId);
  }

  /** 현재 UI는 활성 방이 하나뿐이라 단일 room만 추적한다. */
  setActiveRoom(chatRoomId: string | null): void {
    if (this.desiredRoomId === chatRoomId) return;
    if (this.desiredRoomId) this.sendLeave(this.desiredRoomId);
    this.desiredRoomId = chatRoomId;
    if (chatRoomId) this.sendJoin(chatRoomId);
  }

  disconnect(): void {
    this.intentionallyClosed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.desiredRoomId) this.sendLeave(this.desiredRoomId);
    this.desiredRoomId = null;
    this.socket?.close();
    this.socket = null;
  }
}
