import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { cn } from '@/shared/lib/cn';
import type { ShareableOption, ShareCardType } from '@/features/messenger/types';
import { SHARE_CARD_STYLE } from '@/features/messenger/components/ShareCard/shareCard.styles';

interface ShareItemPickerModalProps {
  type: ShareCardType | null;
  options: ShareableOption[];
  onSelect: (optionId: string) => void;
  onClose: () => void;
  /** 전송 중엔 선택/취소를 막아 중복 클릭으로 같은 카드가 두 번 전송되는 걸 방지한다 */
  isSubmitting?: boolean;
}

export const ShareItemPickerModal = ({
  type,
  options,
  onSelect,
  onClose,
  isSubmitting = false,
}: ShareItemPickerModalProps) => {
  const style = type ? SHARE_CARD_STYLE[type] : null;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (type) setSelectedId(null);
  }, [type]);

  return (
    <Modal
      isOpen={!!type}
      onClose={onClose}
      dismissible={false}
      closeOnOverlayClick
      className="max-w-[500px] rounded-[28px] p-0"
    >
      <div className="flex flex-col gap-2 px-10 pb-3 pt-10">
        <h3 className="text-[18px] font-bold leading-[normal] text-gray-800">
          {style ? `${style.label} 항목 선택` : ''}
        </h3>

        {options.length === 0 ? (
          <p className="py-6 text-center text-[14px] font-normal leading-[normal] text-gray-500">
            공유할 수 있는 항목이 없습니다.
          </p>
        ) : (
          <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto">
            {options.map(option => {
              const selected = selectedId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedId(option.id)}
                  className={cn(
                    'relative flex h-[72px] w-full shrink-0 items-center rounded-lg border pl-[17px] pr-[53px] text-left transition-colors',
                    selected ? 'border-primary-500' : 'border-gray-100 hover:bg-gray-50',
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[16px] font-bold leading-[normal] text-gray-700">{option.title}</span>
                    {option.subtitle && (
                      <span className="text-[14px] font-normal leading-[normal] text-gray-500">
                        {option.subtitle}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'absolute right-[17px] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border',
                      selected ? 'border-primary-500 bg-primary-500' : 'border-gray-400 bg-white',
                    )}
                  >
                    {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 border-t border-gray-100 px-10 py-[26px]">
        <button
          type="button"
          onClick={() => selectedId && onSelect(selectedId)}
          disabled={!selectedId || isSubmitting}
          className="h-[58px] flex-1 rounded-lg bg-primary-600 text-[16px] font-bold leading-[normal] text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '전송 중...' : '선택'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="h-[58px] w-[140px] shrink-0 rounded-lg bg-gray-200 text-[16px] font-bold leading-[normal] text-white transition-colors hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          취소
        </button>
      </div>
    </Modal>
  );
};
