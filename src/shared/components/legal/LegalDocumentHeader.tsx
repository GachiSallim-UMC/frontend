import ChevronLeft from '@/assets/icons/login/chevron-left.svg?react';

interface LegalDocumentHeaderProps {
  title: string;
  onBack: () => void;
  onMobileBack?: () => void;
  effectiveDate?: string;
  variant?: 'signup' | 'settings';
}

export const LegalDocumentHeader = ({
  title,
  onBack,
  onMobileBack,
  effectiveDate = '2026.01.01',
  variant = 'settings',
}: LegalDocumentHeaderProps) => {
  if (variant === 'signup') {
    return (
      <>
        <header className="relative flex h-[52px] flex-shrink-0 items-center justify-center border-b border-gray-100 bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={onMobileBack ?? onBack}
            className="absolute left-4 flex size-6 items-center justify-center text-gray-900"
          >
            <ChevronLeft className="size-6" strokeWidth={1.5} />
          </button>
          <h1 className="text-mobile-title font-bold tracking-[0.04em] text-gray-900">{title}</h1>
        </header>

        <header className="hidden flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-7 lg:flex">
          <div className="flex items-center">
            <button type="button" onClick={onBack} className="mr-1 px-2 py-1" aria-label="뒤로 가기">
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <h1 className="text-xl font-bold tracking-wider text-gray-900">{title}</h1>
          </div>
          <span className="text-sm font-medium text-gray-500">시행일 {effectiveDate}</span>
        </header>
      </>
    );
  }

  return (
    <header className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-white px-4 py-4 lg:px-7 lg:py-7">
      <div className="flex min-w-0 items-center">
        <button
          type="button"
          onClick={onBack}
          className="mr-1 shrink-0 p-2 lg:px-2 lg:py-1"
          aria-label="뒤로 가기"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800 lg:h-6 lg:w-6" />
        </button>
        <h1 className="truncate text-mobile-body font-bold tracking-wider text-gray-900 lg:text-xl">
          {title}
        </h1>
      </div>
      <span className="shrink-0 text-mobile-caption font-medium text-gray-500 lg:text-sm">
        시행일 {effectiveDate}
      </span>
    </header>
  );
};
