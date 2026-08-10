import { useRef, useState, useEffect } from 'react';
import { useAlertStore } from '@/shared/store';

interface ReceiptProps {
  imageUrl?: string;
  onImageChange?: (file: File) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

const ALLOWED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

export const Receipt = ({
  imageUrl,
  onImageChange,
  disabled = false,
  isUploading = false,
}: ReceiptProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(imageUrl);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  useEffect(
    () => () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_RECEIPT_TYPES.includes(file.type)) {
      useAlertStore.getState().showAlert({
        title: '알림',
        message:
          '영수증 규격/형태가 맞지 않습니다. JPEG, PNG, WebP 형식의 이미지만 등록할 수 있습니다.',
      });
      e.target.value = '';
      return;
    }

    if (file.size < 1 || file.size > MAX_RECEIPT_SIZE) {
      useAlertStore.getState().showAlert({
        title: '알림',
        message: '파일 크기는 10MB를 초과할 수 없습니다.',
      });
      e.target.value = '';
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageChange?.(file);
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="flex flex-col gap-3">
          <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img
              src={previewUrl}
              alt="영수증 이미지"
              className="block h-auto w-full object-contain"
            />
          </div>

          <button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled}
            className={`w-full py-2.5 sm:py-2.5 rounded-lg text-white text-button font-bold transition-colors ${
              disabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
            }`}
          >
            {isUploading ? '업로드 중...' : '이미지 교체'}
          </button>

          {disabled && (
            <p className="mt-2 text-caption text-gray-500">
              {isUploading
                ? '이미지 업로드 중에는 교체가 불가능합니다.'
                : '정산 후에는 이미지 교체가 불가능합니다.'}
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={`w-full py-3 sm:py-4 rounded-lg text-white text-button font-bold transition-colors ${
            disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-black cursor-pointer'
          }`}
        >
          {isUploading ? '업로드 중...' : '영수증 이미지 등록'}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
