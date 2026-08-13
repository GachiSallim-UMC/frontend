import CopyIcon from '@/assets/icons/member/copy.svg?react';

interface InvitationCodeBoxProps {
  isCreated: boolean;
  inviteCode?: string;
  onCopyCode: () => void;
}

export const InvitationCodeBox = ({
  isCreated,
  inviteCode,
  onCopyCode,
}: InvitationCodeBoxProps) => (
  <div className="flex min-h-[122px] flex-col items-center justify-center rounded-lg border border-dashed border-primary-300 bg-primary-50 px-4 py-6">
    {!isCreated ? (
      <>
        <p className="text-mobile-body font-bold text-gray-800 lg:text-sm">
          그룹 생성 후 초대 코드가 발급됩니다
        </p>
        <div className="mt-5 flex gap-3.5">
          <span className="size-2 rounded-full bg-primary-700" />
          <span className="size-2 rounded-full bg-primary-600" />
          <span className="size-2 rounded-full bg-primary-500" />
          <span className="size-2 rounded-full bg-primary-400" />
          <span className="size-2 rounded-full bg-primary-300" />
          <span className="size-2 rounded-full bg-primary-200" />
        </div>
      </>
    ) : (
      <>
        <p className="text-mobile-body font-bold text-gray-800 lg:text-sm">초대 코드</p>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-mobile-body font-bold tracking-[0.9em] text-primary-700 lg:text-caption">
            {inviteCode || '코드 발급 지연'}
          </span>
          <button
            type="button"
            onClick={onCopyCode}
            disabled={!inviteCode}
            aria-label="초대 코드 복사"
            className="size-3.5 shrink-0 text-primary-700 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            <CopyIcon className="size-3.5" />
          </button>
        </div>

        <p className="mt-4 text-mobile-caption text-gray-600 lg:text-xs">
          멤버에게 코드를 공유해 초대하세요
        </p>
      </>
    )}
  </div>
);
