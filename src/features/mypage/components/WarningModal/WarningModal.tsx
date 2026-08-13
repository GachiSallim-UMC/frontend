import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import BangIcon from '@/assets/icons/mypage/bang.svg?react';
import { Button, CheckboxGroup, FormInput, Modal } from "@/shared/components"; 

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isWithdrawing?: boolean;
}

const WITHDRAWAL_AGREE_OPTIONS = [
  {
    value: 'agree',
    label: <span className="text-caption text-gray-600">회원 탈퇴 시 유의사항을 확인했고 이에 동의합니다.</span>,
  },
];

export const WarningModal = ({isOpen, onClose, onConfirm, isWithdrawing}: WarningModalProps) => {
    const [checkedValues, setCheckedValues] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCheckedValues([]);
            setInputValue(''); 
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // 체크박스 동의 및 입력 문구가 정확히 일치해야 활성화
    const isValid = checkedValues.includes('agree') && inputValue === '회원탈퇴';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            dismissible={false}
            className="flex max-h-[90dvh] w-full max-w-none flex-col overflow-y-auto rounded-2xl px-5 pb-5 pt-6 lg:h-auto lg:max-h-none lg:w-[660px] lg:rounded-3xl lg:px-10 lg:pb-7 lg:pt-10"
        >
            {/* 상단 아이콘 및 타이틀 */}
            <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 lg:mb-5 lg:h-20 lg:w-20">
                    <BangIcon className="h-7 w-7 text-red-500 lg:h-10 lg:w-10" />
                </div>
                <div className="mb-4 flex flex-col items-center lg:mb-5">
                     <h2 className="mb-1 text-mobile-title font-bold text-gray-900 lg:text-2xl">정말 회원 탈퇴하시겠어요?</h2>
                     <p className="text-mobile-label font-medium text-gray-600 lg:text-sm">탈퇴 전 아래 내용을 꼭 확인해주세요.</p>
                </div>
            </div>

            {/* 유의사항 박스 */}
            <div className="mb-4 rounded-lg bg-red-100 py-3 pl-4 lg:py-5 lg:pl-5">
                <h3 className="mb-2 text-mobile-body font-bold text-red-700 lg:mb-3 lg:text-xl">탈퇴 시 유의사항</h3>
                <ul className="ml-4 list-disc text-mobile-label font-medium leading-tight text-gray-600 lg:ml-5 lg:text-base">
                    <li>공동 생활방, 정산, 집안일 기록에 더 이상 접근할 수 없어요.</li>
                    <li>삭제된 계정과 데이터는 복구할 수 없어요.</li>
                    <li>방장이라면 먼저 다른 구성원에게 방장을 위임해야 해요.</li>
                </ul>
            </div>

            {/* 동의 체크박스 */}
            <CheckboxGroup
                className="mb-4 [&_input]:!h-5 [&_input]:!w-5 lg:mb-7"
                options={WITHDRAWAL_AGREE_OPTIONS}
                value={checkedValues}
                onChange={setCheckedValues}
            />

            {/* 입력창 */}
            <div className="mb-6 flex flex-col gap-2 lg:mb-16">
                <label className="text-mobile-label font-bold text-gray-800 lg:text-lg">확인을 위해 회원탈퇴를 입력해주세요.</label>
                <FormInput
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="회원탈퇴 입력"
                    disabled={isWithdrawing}
                    className="h-11 text-mobile-label lg:h-[50px] lg:text-button"
                />
                <p className="text-mobile-caption font-medium text-gray-400 lg:text-sm">문구가 정확히 일치해야 탈퇴 버튼이 활성화돼요.</p>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex w-full items-center justify-center gap-3 border-t border-gray-100 pt-4 lg:gap-5 lg:pt-6">
                <Button
                    variant="primary"
                    size="lg"
                    disabled={!isValid || isWithdrawing}
                    onClick={onConfirm}
                    className="h-11 flex-[2] text-mobile-body !border-red-700 !bg-red-700 hover:!bg-red-800 lg:h-12 lg:text-base"
                >
                    회원 탈퇴
                </Button>

                <Button
                    variant="secondary"
                    size="lg"
                    disabled={isWithdrawing}
                    onClick={onClose}
                    className="h-11 flex-1 text-mobile-body !border-gray-200 !bg-gray-200 hover:!bg-gray-300 lg:h-12 lg:text-base"
                >
                    취소
                </Button>
            </div>
        </Modal>
    );
};
