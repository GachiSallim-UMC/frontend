import { useState } from 'react';
import { Crown, LogOut, MoreVertical, Trash2, UserPlus, UserX, X } from 'lucide-react';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';
import { Switch } from '@/shared/components/ui/Switch';
import { cn } from '@/shared/lib/cn';
import type { ChatRoom, ChatRoomCategory, ChatRoomMember } from '@/features/messenger/types';
import roomRoommateIcon from '@/assets/icons/messenger/room-roommate.png';
import roomNoticeIcon from '@/assets/icons/messenger/room-notice.png';

const CATEGORY_LABEL: Record<ChatRoomCategory, string> = {
  group: '그룹 채팅',
  notice: '공지',
  dm: '1:1 대화',
};

const CATEGORY_THUMBNAIL: Partial<Record<ChatRoomCategory, string>> = {
  group: roomRoommateIcon,
  notice: roomNoticeIcon,
};

interface ChatRoomManagePanelProps {
  room: ChatRoom;
  currentUserId: string;
  onClose: () => void;
  onInviteMember: () => void;
  onKickMember: (member: ChatRoomMember) => void;
  onRequestTransferOwner: (member: ChatRoomMember) => void;
  onToggleNotification: (enabled: boolean) => void;
  onTogglePin: (pinned: boolean) => void;
  onLeaveRoom: () => void;
  onDeleteRoom: () => void;
  className?: string;
}

export const ChatRoomManagePanel = ({
  room,
  currentUserId,
  onClose,
  onInviteMember,
  onKickMember,
  onRequestTransferOwner,
  onToggleNotification,
  onTogglePin,
  onLeaveRoom,
  onDeleteRoom,
  className,
}: ChatRoomManagePanelProps) => {
  const isOwner = room.members.some(member => member.id === currentUserId && member.isOwner);
  const [openMenuMemberId, setOpenMenuMemberId] = useState<string | null>(null);

  return (
    <div className={cn('flex h-full w-[360px] shrink-0 flex-col border-l border-gray-100 bg-white', className)}>
      <div className="flex h-[78px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
        <h2 className="text-[20px] font-bold leading-[normal] tracking-[0.8px] text-gray-900">채팅방 관리</h2>
        <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
        <div className="flex h-[76px] shrink-0 items-center gap-2.5 rounded-lg border border-gray-100 px-4">
          {CATEGORY_THUMBNAIL[room.category] ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-200">
              <img src={CATEGORY_THUMBNAIL[room.category]} alt="" className="h-[38px] w-[38px]" />
            </div>
          ) : (
            <UserAvatar name={room.name} avatarUrl={room.avatarUrl} size="lg" className="h-12 w-12 shrink-0" />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-[16px] font-bold leading-[normal] text-gray-700">{room.name}</span>
            <span className="text-[12px] font-normal leading-[normal] text-gray-600">
              {CATEGORY_LABEL[room.category]} · 멤버 {room.members.length}명
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold leading-[normal] text-gray-800">멤버</h3>
            <button
              type="button"
              onClick={onInviteMember}
              className="flex items-center gap-1 text-[12px] font-bold leading-[normal] text-primary-600 hover:text-primary-700"
            >
              <UserPlus className="h-4 w-4" />
              멤버 초대
            </button>
          </div>
          <div className="flex flex-col">
            {room.members.map(member => {
              const isSelf = member.id === currentUserId;
              const menuOpen = openMenuMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className="relative flex h-[60px] items-center justify-between border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={member.name} avatarUrl={member.avatarUrl} size="md" className="h-10 w-10" />
                    <span className="flex items-center gap-1 text-[16px] leading-[normal]">
                      <span className="font-bold text-gray-900">{member.name}</span>
                      {isSelf && <span className="font-normal text-gray-400">(나)</span>}
                    </span>
                  </div>
                  {member.isOwner ? (
                    <span className="flex h-[22px] w-10 items-center justify-center rounded text-[12px] leading-[normal] text-white bg-primary-700">
                      방장
                    </span>
                  ) : isSelf ? (
                    <span className="text-[16px] font-bold leading-[normal] text-gray-400">나</span>
                  ) : (
                    isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenMenuMemberId(menuOpen ? null : member.id)}
                          aria-label={`${member.name} 관리`}
                          className="text-gray-500 transition-colors hover:text-gray-700"
                        >
                          <MoreVertical className="h-6 w-6" />
                        </button>
                        {menuOpen && (
                          <>
                            <button
                              type="button"
                              aria-label="메뉴 닫기"
                              className="fixed inset-0 z-10 cursor-default"
                              onClick={() => setOpenMenuMemberId(null)}
                            />
                            <div className="absolute right-0 top-[46px] z-20 flex w-[152px] flex-col overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-dropdown">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuMemberId(null);
                                  onRequestTransferOwner(member);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 text-left text-[14px] font-normal leading-[normal] text-gray-700 hover:bg-gray-50"
                              >
                                <Crown className="h-4 w-4" />
                                방장 위임
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuMemberId(null);
                                  onKickMember(member);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 text-left text-[14px] font-normal leading-[normal] text-red-700 hover:bg-red-100"
                              >
                                <UserX className="h-4 w-4" />
                                강제 퇴장
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-bold leading-[normal] text-gray-800">설정</h3>
          <div className="flex flex-col">
            <div className="flex h-[52px] items-center justify-between border-b border-gray-100">
              <span className="text-[16px] font-normal leading-[normal] text-gray-900">메시지 알림</span>
              <Switch checked={room.notificationEnabled} onChange={onToggleNotification} />
            </div>
            <div className="flex h-[52px] items-center justify-between border-b border-gray-100">
              <span className="text-[16px] font-normal leading-[normal] text-gray-900">상단 고정</span>
              <Switch checked={room.isPinned} onChange={onTogglePin} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-4 border-t border-gray-100 p-5">
        <button
          type="button"
          onClick={onLeaveRoom}
          className="flex h-[50px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-[16px] font-normal leading-[normal] text-gray-500 transition-colors hover:bg-gray-50"
        >
          <LogOut className="h-6 w-6" />
          나가기
        </button>
        <button
          type="button"
          onClick={onDeleteRoom}
          disabled={!isOwner}
          className={cn(
            'flex h-[50px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500 text-[16px] font-normal leading-[normal] text-red-700 transition-colors hover:bg-red-100',
            !isOwner && 'cursor-not-allowed opacity-50 hover:bg-transparent',
          )}
        >
          <Trash2 className="h-6 w-6" />
          삭제
        </button>
      </div>
    </div>
  );
};
