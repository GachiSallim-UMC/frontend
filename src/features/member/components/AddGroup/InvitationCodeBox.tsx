import CopyIcon from "@/assets/icons/member/copy.svg?react"

interface InvitationCodeBoxProps {
  isCreated: boolean;
  onCopyCode: () => void;
}

export const InvitationCodeBox = ({
    isCreated,
    onCopyCode,
}: InvitationCodeBoxProps) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-primary-300 bg-primary-50 pt-6 pb-5">
            {!isCreated ? (
                <>
                    <p className="text-sm font-bold text-gray-800">
                        그룹 생성 후 초대 코드가 발급됩니다
                    </p>
                    <div className="mt-5 flex gap-3.5">
                        <span className="h-2 w-2 rounded-full bg-primary-700"></span>
                        <span className="h-2 w-2 rounded-full bg-primary-600"></span>
                        <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                        <span className="h-2 w-2 rounded-full bg-primary-400"></span>
                        <span className="h-2 w-2 rounded-full bg-primary-300"></span>
                        <span className="h-2 w-2 rounded-full bg-primary-200"></span>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-sm font-bold text-gray-800">
                        초대 코드
                    </p>
                    <div className="mt-4 flex items-center justify-center text-caption font-bold">
                        <span className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="text-primary-700 tracking-[0.4em]">{'ABCDEF'.split('').join(' ')}</span>
                            <button 
                            type="button"
                            onClick={onCopyCode}
                            className="ml-3 text-primary-700 transition-opacity hover:opacity-70 h-3.5 w-3.5"
                        >
                            <CopyIcon />   
                        </button>
                    </div>
                    <p className="mt-4 text-xs text-gray-600">
                        멤버에게 코드를 공유해 초대하세요
                    </p>
                </>
            )}
        </div>
    );
};