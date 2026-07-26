import NoResultsIcon from '@/assets/icons/messenger/no-search-results.svg?react';

interface NoSearchResultsProps {
  query: string;
  onCreateRoom: (name: string) => void;
}

export const NoSearchResults = ({ query, onCreateRoom }: NoSearchResultsProps) => {
  return (
    <div className="flex flex-col items-center gap-5 pt-16 text-center">
      <div className="flex flex-col items-center gap-2">
        <NoResultsIcon className="h-[34px] w-[34px]" />
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium leading-[normal] text-gray-900">'{query}' 검색 결과가 없어요</p>
          <p className="text-[13px] font-normal leading-[1.2] text-gray-500">
            다른 이름으로 검색하거나 이 이름으로
            <br />새 채팅방을 만들 수 있어요.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onCreateRoom(query)}
        className="flex h-10 w-[154px] items-center justify-center rounded-lg border border-primary-500 bg-primary-100 text-[13px] font-medium leading-[normal] text-primary-500 transition-colors hover:bg-primary-200"
      >
        '{query}' 채팅방 만들기
      </button>
    </div>
  );
};
