import { TextArea } from '@/shared/components';

interface ChoreMemoProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const ChoreMemo = ({ value, error, onChange }: ChoreMemoProps) => {
  return (
    <section className="flex w-full flex-col justify-center gap-[20px] rounded-[18px] bg-white p-[30px]">
      <h2 className="text-[18px] font-bold text-gray-800">메모</h2>
      <TextArea
        className="h-[100px] text-[16px]"
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
