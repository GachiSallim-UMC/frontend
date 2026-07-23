import { useState } from "react";
import BangIcon from '@/assets/icons/mypage/bang.svg?react'
import { Button } from "@/shared/components";

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const WITHDRAWAL_AGREE_OPTIONS = [
  {
    value: 'agree1',
    label: <span className="text-caption text-gray-600">삭제 후에는 그룹을 복구할 수 없습니다.</span>,
  },
  {
    value: 'agree2',
    label: <span className="text-caption text-gray-600">모든 구성원이 그룹에서 제거됩니다.</span>,
  },
];



export const WarningModal = ({isOpen, onClose, onConfirm}: WarningModalProps) => {

    const handleCheckboxToggle = (value: string) => {
        if (checkedValues.includes(value)) {
            setCheckedValues(checkedValues.filter((v) => v !== value));
        } else {
            setCheckedValues([...checkedValues, value]);
        }
    };

    const [checkedValues, setCheckedValues] = useState<string[]>([]);

    if (!isOpen) return null;

    // 체크박스 동의 및 입력 문구가 정확히 일치해야 활성화
  const isValid = checkedValues.includes('agree1') && checkedValues.includes('agree2');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
        <div className="flex  w-[660px] flex-col rounded-3xl bg-white px-10 pt-10 pb-7 shadow-dropdown">

            {/* 상단 아이콘 및 타이틀 */}
            <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex items-center justify-center h-20 w-20 bg-red-100 rounded-full">
                    <BangIcon className="h-10 w-10 text-red-500" />
                </div>
                <div className="mb-5 flex flex-col items-center">
                         <h1 className="mb-1 text-2xl text-gray-900 font-bold">그룹을 삭제하시겠습니까?</h1>
                         <p className="text-sm font-medium text-gray-600">삭제 전 아래 내용을 꼭 확인해주세요.</p>
                </div>
            </div>

            {/* 유의사항 박스 */}
            <div className="mb-4 rounded-lg bg-red-100 pl-5 py-5">
                <h3 className="mb-1 text-xl font-bold text-red-700">그룹 삭제 시 유의사항</h3>
                <p className="mb-3 text-sm font-medium text-gray-600">그룹을 삭제하면 아래 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
                <ul className="ml-5 list-disc text-base font-medium text-gray-600 leading-tight">
                    <li>그룹 정보</li>
                    <li>구성원 목록</li>
                    <li>집안일 기록</li>
                    <li>정산 내역</li>
                    <li>공지 및 생활 규칙</li>
                    <li>기타 그룹 데이터</li>
                </ul>
            </div>

            {/* 동의 체크박스 */}
            <div className="mb-16 flex flex-col gap-3">
                <label className="mb-1 text-lg text-gray-800 font-bold">확인을 위해 체크해주세요.</label>
                <div className="flex flex-col gap-2">
                    {WITHDRAWAL_AGREE_OPTIONS.map((option) => (
                        <label key={option.value} className="flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-300 accent-primary-500"
                                checked={checkedValues.includes(option.value)}
                                onChange={() => handleCheckboxToggle(option.value)}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
                </div>

            {/* 버튼 그룹 */}
            <div className="flex items-center justify-center w-full gap-5 border-t border-gray-100 pt-6">
                <Button
                    variant="primary"
                    size="lg"
                    disabled={!isValid}
                    onClick={onConfirm}
                    className="flex-[2] !bg-red-700 !border-red-700 hover:!bg-red-800"
                >그룹 삭제</Button>

                <Button
                    variant="secondary"
                    size="lg"
                    onClick={onClose}
                    className="flex-1 !bg-gray-200 !border-gray-200 hover:!bg-gray-300"
                >취소</Button>

            </div>
        </div>
    </div>
  );
};