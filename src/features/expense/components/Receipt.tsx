import { useRef, useState, useEffect } from 'react';

interface ReceiptProps {
  imageUrl?: string;
  onImageChange?: (file: File) => void;
  disabled?: boolean;
}

export const Receipt = ({ imageUrl, onImageChange, disabled = false }: ReceiptProps) => {
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
            이미지 교체
          </button>
          {disabled && (
            <p className='text-caption text-red-500 text-center'>
              정산 후에는 이미지 교체가 불가능합니다.
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
          영수증 이미지 등록
        </button>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />
    </div>
  );
};