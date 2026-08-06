interface DateDividerProps {
  /** 원본 ISO 시각 */
  date: string;
}

const formatDivider = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

export const DateDivider = ({ date }: DateDividerProps) => (
  <div className="flex justify-center">
    <span className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-medium leading-[normal] text-gray-600">
      {formatDivider(date)}
    </span>
  </div>
);
