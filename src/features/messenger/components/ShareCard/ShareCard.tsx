import { cn } from '@/shared/lib/cn';
import type { ChatShareCard } from '@/features/messenger/types';
import { SHARE_CARD_STYLE } from '@/features/messenger/components/ShareCard/shareCard.styles';

interface ShareCardProps extends ChatShareCard {
  onViewDetail?: () => void;
  onAction?: () => void;
}

export const ShareCard = ({
  type,
  title,
  headline,
  details,
  actionLabel,
  onViewDetail,
  onAction,
}: ShareCardProps) => {
  const style = SHARE_CARD_STYLE[type];
  const { Icon } = style;

  return (
    <div className="w-[325px] overflow-hidden rounded-[10px] bg-white">
      <div className={cn('flex items-center gap-1.5 px-4 py-3', style.headerBg)}>
        <Icon className="h-4 w-4" />
        <span className={cn('text-[14px] font-bold leading-[normal]', style.accent)}>{style.label}</span>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
        <p className="text-[16px] font-normal leading-[normal] text-gray-900">
          <span className="font-bold">{title}</span>
          {headline}
        </p>
        {details && details.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-gray-100 pt-2 text-[12px] font-normal leading-[normal] text-gray-900">
            {details.map(detail =>
              detail.value === undefined ? (
                <span key={detail.label}>{detail.label}</span>
              ) : (
                <div key={detail.label} className="flex items-center justify-between">
                  <span>{detail.label}</span>
                  <span className="text-right">{detail.value}</span>
                </div>
              ),
            )}
          </div>
        )}
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={onViewDetail}
            className={cn(
              'h-9 flex-1 rounded-lg border bg-white text-center text-[12px] font-bold leading-[normal]',
              style.outline,
            )}
          >
            상세 보기
          </button>
          <button
            type="button"
            onClick={onAction}
            className={cn('h-9 flex-1 rounded-lg text-center text-[12px] font-bold leading-[normal]', style.fill)}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
