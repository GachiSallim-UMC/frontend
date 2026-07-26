import { UserAvatar } from '@/shared/components';
import type { Member } from '@/features/member'

const mockMembers: Member[] = [
  { id: '1', userId:'1', name: '홍길동', role: 'ADMIN' },
  { id: '2', userId:'2', name: '김영희', role: 'MEMBER', joinedAt: '2026.03.02', avatarId: 2 },
  { id: '3', userId:'3', name: '이철수', role: 'MEMBER', joinedAt: '2025.02.31', avatarId: 2 },
];

export const MemberManagement = () => {
  const handleDelegateAdmin = (name: string) => {
    alert(`${name}님에게 관리자 권한을 위임하시겠습니까?`);
  };

  const handleKickOut = (name: string) => {
    alert(`${name}님을 내보내시겠습니까?`);
  };

  return (
    <section className="flex w-full flex-col rounded-2xl bg-white p-7">
      <h3 className="mb-5 text-lg font-bold text-gray-900 leading-snug">멤버 관리</h3>

      {/* 멤버 리스트 영역 */}
      <div className="flex flex-col">
        {mockMembers.map((member, index) => (
          <div
            key={member.id}
            className={`flex items-center justify-between p-3 ${
              index !== mockMembers.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            {/* 좌측 */}
            <div className="flex items-center">
              <UserAvatar
                name={member.name}
                avatarUrl={member.avatarUrl}
                avatarId={member.avatarId}
                size="lg"
                className="mr-2"
              />

              <div className="flex items-center gap-6">
                <span className="text-base font-bold text-gray-900">{member.name}</span>

                <span
                  className={`flex h-6 w-14 items-center justify-center rounded-md px-2 py-1 text-xs text-white ${
                    member.role === 'ADMIN' ? 'bg-primary-600' : 'bg-gray-400'
                  }`}
                >
                  {member.role === 'ADMIN' ? '관리자' : '멤버'}
                </span>
              </div>

              {/* 관리자 위임 / 내보내기 버튼 */}
              {member.role === 'MEMBER' && (
                <div className="ml-6 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelegateAdmin(member.name)}
                    className="rounded-md border border-gray-100 bg-white px-3 py-1 text-xs text-gray-900 transition-colors hover:bg-gray-100"
                  >
                    관리자 위임
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKickOut(member.name)}
                    className="rounded-md border border-gray-100 bg-white px-3 py-1 text-xs text-gray-900 transition-colors hover:bg-gray-100"
                  >
                    내보내기
                  </button>
                </div>
              )}
            </div>

            {/* 우측 영역: 가입일 */}
            {member.joinedAt && (
              <span className="text-sm text-gray-500">{member.joinedAt}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};