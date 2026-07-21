import { Modal } from '@/shared/components/ui/Modal';
import type { ShareableOption, ShareCardType } from '@/features/messenger/types';
import { SHARE_CARD_STYLE } from '@/features/messenger/components/ShareCard/shareCard.styles';

interface ShareItemPickerModalProps {
  type: ShareCardType | null;
  options: ShareableOption[];
  onSelect: (optionId: string) => void;
  onClose: () => void;
}

export const ShareItemPickerModal = ({ type, options, onSelect, onClose }: ShareItemPickerModalProps) => {
  const style = type ? SHARE_CARD_STYLE[type] : null;

  return (
    <Modal isOpen={!!type} onClose={onClose} title={style ? `${style.label} 항목 선택` : undefined}>
      {options.length === 0 ? (
        <p className="py-6 text-center text-[14px] font-normal leading-[normal] text-gray-500">
          공유할 수 있는 항목이 없습니다.
        </p>
      ) : (
        <ul className="flex max-h-[360px] flex-col gap-2 overflow-y-auto">
          {options.map(option => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                className="flex w-full flex-col gap-0.5 rounded-lg border border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-[14px] font-bold leading-[normal] text-gray-900">{option.title}</span>
                {option.subtitle && (
                  <span className="text-[12px] font-normal leading-[normal] text-gray-500">
                    {option.subtitle}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};
