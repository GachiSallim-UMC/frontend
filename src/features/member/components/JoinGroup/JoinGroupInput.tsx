import { Button, FormInput } from '@/shared/components';

interface JoinGroupInputProps {
  inviteCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  error?: string;
  disabled?: boolean;
}

export const JoinGroupInput = ({
  inviteCode,
  onChange,
  onConfirm,
  error,
  disabled = false,
}: JoinGroupInputProps) => {
  const isButtonActive = inviteCode.trim().length > 0;

  return (
    <div className="flex w-full flex-col">
      <label
        htmlFor="invite-code"
        className="mb-2 text-mobile-body font-bold text-gray-700 lg:text-base lg:text-gray-900"
      >
        초대 코드 입력
      </label>

      {/* 입력과 확인 버튼은 한 줄. 오류 문구가 버튼을 밀지 않도록 items-start로 둡니다. */}
      <div className="flex w-full items-start gap-3 lg:gap-5">
        <div className="flex-[3]">
          <FormInput
            id="invite-code"
            type="text"
            value={inviteCode}
            onChange={onChange}
            disabled={disabled}
            maxLength={6}
            autoCapitalize="characters"
            placeholder="6자리 코드 입력 (예: AB2CDE)"
            error={error}
            className="h-11 lg:h-[50px]"
          />
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={!isButtonActive || disabled}
          onClick={onConfirm}
          className="h-11 w-[88px] shrink-0 bg-primary-700 text-mobile-body font-bold hover:bg-primary-600 lg:h-[50px] lg:w-auto lg:flex-1 lg:bg-primary-600 lg:text-button lg:hover:bg-primary-700"
        >
          확인
        </Button>
      </div>

      <p className="mt-2 text-mobile-label font-medium text-gray-400 lg:text-sm">
        초대 코드는 그룹 관리자에게 받으세요
      </p>
    </div>
  );
};
