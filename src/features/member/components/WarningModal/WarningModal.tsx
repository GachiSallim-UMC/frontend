import { useState, useEffect } from 'react';
import TrashIcon from '@/assets/icons/member/trash.svg?react';
import { Button, CheckboxGroup, Modal, ConfirmModal } from '@/shared/components';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
}

const GROUP_DELETE_AGREE_OPTIONS = [
  {
    value: 'agree1',
    label: (
      <span className="text-[16px] text-gray-600">삭제 후에는 그룹을 복구할 수 없습니다.</span>
    ),
  },
  {
    value: 'agree2',
    label: <span className="text-[16px] text-gray-600">모든 구성원이 그룹에서 제거됩니다.</span>,
  },
];

export const WarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  errorMessage,
}: WarningModalProps) => {
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCheckedValues([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = checkedValues.includes('agree1') && checkedValues.includes('agree2');

  return (
    <>
      <div className="hidden lg:block">
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          dismissible={false}
          className="flex w-[660px] h-[696px] max-w-none flex-col rounded-3xl p-0 overflow-hidden bg-white"
        >
          {/* 상단 아이콘 및 타이틀 */}
          <div className="mt-[40px] flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-[72px] w-[72px] bg-red-100 rounded-full">
              <TrashIcon className="h-[30px] w-[30px] text-red-500" />
            </div>
            <div className="mt-[20px] flex flex-col text-center items-center">
              <h2 className="text-[24px] text-gray-900 font-bold">그룹을 삭제하시겠습니까?</h2>
              <p className="text-[14px] font-medium text-gray-600">
                삭제 전 아래 내용을 꼭 확인해주세요.
              </p>
            </div>
          </div>

          {/* 유의사항 박스 */}
          <div className="mt-[20px] mx-[40px] rounded-lg bg-red-100 p-[20px]">
            <h3 className="text-[20px] font-bold text-red-700">그룹 삭제 시 유의사항</h3>
            <p className="mb-3 text-[14px] font-medium text-gray-600">
              그룹을 삭제하면 아래 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <ul className="ml-5 list-disc text-[16px] font-medium text-gray-600 leading-tight">
              <li>그룹 정보</li>
              <li>구성원 목록</li>
              <li>집안일 기록</li>
              <li>정산 내역</li>
              <li>공지 및 생활 규칙</li>
              <li>기타 그룹 데이터</li>
            </ul>
          </div>

          {/* 동의 체크박스 */}
          <div className="mt-[30px] px-[40px] flex flex-col gap-3">
            <label className="text-[18px] text-gray-800 font-bold">확인을 위해 체크해주세요.</label>
            <CheckboxGroup
              direction="col"
              options={GROUP_DELETE_AGREE_OPTIONS}
              value={checkedValues}
              onChange={setCheckedValues}
              size="sm"
              className="[&_label]:gap-3"
            />
          </div>
          {errorMessage && (
            <div className="mt-4 px-[40px] text-center text-sm font-medium text-red-500">
              {errorMessage}
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="mt-auto flex items-center justify-center w-full gap-5 border-t border-gray-100 px-[40px] py-[27px]">
            <Button
              variant="primary"
              size="lg"
              disabled={!isValid}
              isLoading={isSaving}
              onClick={onConfirm}
              className="flex-[2] !bg-red-700 font-bold !border-red-700 hover:!bg-red-500"
            >
              그룹 삭제
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onClose}
              className="flex-1 !bg-gray-200 font-bold text-white !border-gray-200 hover:!bg-gray-300"
            >
              취소
            </Button>
          </div>
        </Modal>
      </div>

      <div className="lg:hidden">
        <ConfirmModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={onConfirm}
          icon={<TrashIcon className="size-6 text-red-500" />}
          title="그룹을 삭제할까요?"
          description="삭제한 그룹은 복구할 수 없어요."
          confirmLabel="삭제"
          cancelLabel="취소"
          tone="danger"
          isPending={isSaving}
          errorMessage={errorMessage || undefined}
        />
      </div>
    </>
  );
};
