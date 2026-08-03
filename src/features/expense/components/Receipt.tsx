import { useRef, useState, useEffect } from 'react';
import { useErrorStore } from '@/shared/store';

interface ReceiptProps {
  imageUrl?: string;
  onImageChange?: (file: File) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

const ALLOWED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

export const Receipt = ({ imageUrl, onImageChange, disabled = false, isUploading = false }: ReceiptProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(imageUrl);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_RECEIPT_TYPES.includes(file.type)) {
      useErrorStore.getState().showError({
        title: '알림',
        message: '영수증 규격/형태가 맞지 않습니다. JPEG, PNG, WebP 형식의 이미지만 등록할 수 있습니다.',
      });
      e.target.value = '';
      return;
    }

    if (file.size > MAX_RECEIPT_SIZE) {
      useErrorStore.getState().showError({
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
    <div className='w-full border border-dashed border-gray-900 rounded-[18px] flex flex-col items-center bg-white p-4 gap-3'>
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="영수증"
            className='w-full max-w-full h-auto object-contain rounded-[8px]'
          />
          <button
            type='button'
            onClick={handleButtonClick}
            disabled={disabled}
            className={`w-full py-2.5 rounded-lg text-white text-button font-bold transition-colors ${
              disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
            }`}
          >
            {isUploading ? '업로드 중...' : '이미지 교체'}
          </button>
          {disabled && (
            <p className='text-caption text-red-700 text-center'>
              {isUploading ? '이미지 업로드 중에는 교체가 불가능합니다.' : '정산 후에는 이미지 교체가 불가능합니다.'}
            </p>
          )}
        </>
      ) : (
        <button
          type='button'
          onClick={handleButtonClick}
          disabled={disabled}
          className={`w-full py-4 rounded-lg text-white text-button font-bold transition-colors ${
            disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black cursor-pointer'
          }`}
        >
          {isUploading ? '업로드 중...' : '영수증 이미지 등록'}
        </button>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        onChange={handleFileChange}
        className='hidden'
      />
    </div>
  );
};
