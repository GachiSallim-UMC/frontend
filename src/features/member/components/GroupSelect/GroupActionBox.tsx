import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components';
import CircleIcon from '@/assets/icons/member/circle.svg?react';
import PlusIcon from '@/assets/icons/member/plus.svg?react';

/** 새 그룹 생성/코드 입력 안내 박스. 모바일은 아이콘 60px, 데스크톱은 기존 크기를 유지합니다. */
export const GroupActionBox = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 rounded-lg border border-dashed border-primary-300 bg-primary-50 px-4 py-5 lg:mb-8 lg:justify-center lg:gap-5 lg:px-22">
      <div className="relative shrink-0">
        <CircleIcon className="size-[60px] lg:size-21" />
        <PlusIcon className="absolute left-1/2 top-1/2 size-[26px] -translate-x-1/2 -translate-y-1/2 lg:size-9" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col lg:flex-none">
        <h3 className="text-mobile-body font-bold text-gray-900 lg:text-base lg:text-gray-800">
          새 그룹이 필요하신가요?
        </h3>
        <p className="mb-2 mt-px text-mobile-caption font-medium text-gray-600 lg:mb-2 lg:mt-1 lg:text-xs">
          새 그룹을 만들거나 초대 코드를 입력해 참여할 수 있어요.
        </p>

        <div className="flex gap-2.5 lg:gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/group/add')}
            className="h-9 flex-1 bg-primary-700 text-mobile-label font-bold hover:bg-primary-600 lg:h-8 lg:bg-primary-600 lg:text-xs lg:hover:bg-primary-700"
          >
            그룹 생성
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/group/join')}
            className="h-9 flex-1 text-mobile-label font-bold lg:h-8 lg:text-xs"
          >
            코드 입력
          </Button>
        </div>
      </div>
    </div>
  );
};
