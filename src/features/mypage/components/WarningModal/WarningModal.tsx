import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import BangIcon from '@/assets/icons/mypage/bang.svg?react';
import { Button, CheckboxGroup, FormInput, Modal } from "@/shared/components"; 

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const WITHDRAWAL_AGREE_OPTIONS = [
  {
    value: 'agree',
    label: <span className="text-caption text-gray-600">회원 탈퇴 시 유의사항을 확인했고 이에 동의합니다.</span>,
  },
];

export const WarningModal = ({isOpen, onClose, onConfirm}: WarningModalProps) => {
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
            className="w-[660px] max-w-none flex-col rounded-3xl px-10 pb-7 pt-10"
        >
            {/* 상단 아이콘 및 타이틀 */}
            <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <BangIcon className="h-10 w-10 text-red-500" />
                </div>
                <div className="mb-5 flex flex-col items-center">
                     <h1 className="mb-1 text-2xl font-bold text-gray-900">정말 회원 탈퇴하시겠어요?</h1>
                     <p className="text-sm font-medium text-gray-600">탈퇴 전 아래 내용을 꼭 확인해주세요.</p>
                </div>
            </div>

            {/* 유의사항 박스 */}
            <div className="mb-4 rounded-lg bg-red-100 py-5 pl-5">
                <h3 className="mb-3 text-xl font-bold text-red-700">탈퇴 시 유의사항</h3>
                <ul className="ml-5 list-disc text-base font-medium leading-tight text-gray-600">
                    <li>공동 생활방, 정산, 집안일 기록에 더 이상 접근할 수 없어요.</li>
                    <li>삭제된 계정과 데이터는 복구할 수 없어요.</li>
                    <li>방장이라면 먼저 다른 구성원에게 방장을 위임해야 해요.</li>
                </ul>
            </div>

            {/* 동의 체크박스 */}
            <CheckboxGroup
                className="mb-7 [&_input]:!h-5 [&_input]:!w-5"
                options={WITHDRAWAL_AGREE_OPTIONS}
                value={checkedValues}
                onChange={setCheckedValues}
            />

            {/* 입력창 */}
            <div className="mb-16 flex flex-col gap-2">
                <label className="text-lg font-bold text-gray-800">확인을 위해 회원탈퇴를 입력해주세요.</label>
                <FormInput
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="회원탈퇴 입력"
                />
                <p className="text-sm font-medium text-gray-400">문구가 정확히 일치해야 탈퇴 버튼이 활성화돼요.</p>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex w-full items-center justify-center gap-5 border-t border-gray-100 pt-6">
                <Button
                    variant="primary"
                    size="lg"
                    disabled={!isValid}
                    onClick={onConfirm}
                    className="flex-[2] !border-red-700 !bg-red-700 hover:!bg-red-800"
                >
                    회원 탈퇴
                </Button>

                <Button
                    variant="secondary"
                    size="lg"
                    onClick={onClose}
                    className="flex-1 !border-gray-200 !bg-gray-200 hover:!bg-gray-300"
                >
                    취소
                </Button>
            </div>
        </Modal>
    );
};