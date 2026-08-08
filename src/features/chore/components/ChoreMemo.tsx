import { TextArea } from '@/shared/components';

interface ChoreMemoProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const ChoreMemo = ({ value, error, onChange }: ChoreMemoProps) => {
  return (
    <section className="flex w-full flex-col justify-center gap-[8px] bg-transparent lg:gap-[20px] lg:rounded-[18px] lg:bg-white lg:p-[30px]">
      <h2 className="text-[14px] lg:text-[18px] font-bold text-gray-800">메모</h2>
      <TextArea
        className="h-[88px] text-[14px] lg:h-[100px] lg:text-[16px]"
        placeholder="집안일에 대한 추가 설명 (선택)"
        value={value}
        maxLength={255}
        showCount
        error={error}
        onChange={e => onChange(e.target.value)}
      />
    </section>
  );
};
