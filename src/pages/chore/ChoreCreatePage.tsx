import { ChoreBasicInfo, ChoreFormActions, ChoreMemo, ChoreRepeat } from '@/features/chore';

export const ChoreCreatePage = () => {
  return (
    <div className="mt-[28px] h-fit flex w-full max-w-[1114px] flex-col gap-[30px] p-[20px]">
      <ChoreBasicInfo />
      <ChoreRepeat />
      <ChoreMemo />
      <ChoreFormActions />
    </div>
  );
};
