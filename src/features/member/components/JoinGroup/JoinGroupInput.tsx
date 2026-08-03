import { Button, FormInput } from "@/shared/components";

interface JoinGroupInputProps {
    inviteCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  error?: string;
  disabled?: boolean;
}

export const JoinGroupInput =({
    inviteCode,
    onChange,
    onConfirm,
    error,
    disabled = false,
}: JoinGroupInputProps) => {
    const isButtonActive = inviteCode.trim().length > 0;

    return (
        <div className="flex w-full flex-col">
            <label className="mb-2 text-base font-bold text-gray-900">
                초대 코드 입력
            </label>
            <div className="flex w-full items-center gap-5">
            <div className="flex-[3]">
            <FormInput
                type="text"
                value={inviteCode}
                onChange={onChange}
                disabled={disabled}
                maxLength={6}
                autoCapitalize="characters"
                placeholder="6자리 코드 입력 (예: AB2CDE)"
                error={error}
            />
            </div>
            <div className="flex-1">
            <Button
                variant="primary"
                size="md"
                disabled={!isButtonActive || disabled}
                onClick={onConfirm}
                className="w-full"
            >
                확인
            </Button>
            </div>
        </div>

        <p className="mt-2 text-sm text-gray-400 font-medium">
            초대 코드는 그룹 관리자에게 받으세요
        </p>
        </div>
    );
};
