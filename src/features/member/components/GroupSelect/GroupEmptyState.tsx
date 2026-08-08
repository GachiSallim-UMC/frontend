import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components';
import emptyGroupImage from '@/assets/images/member/empty-group.png';
import { GroupOrDivider } from './GroupOrDivider';

/** 참여 중인 그룹이 하나도 없을 때 보여주는 안내 화면. */
export const GroupEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center py-10">
      <img
        src={emptyGroupImage}
        alt=""
        className="h-[150px] w-[183px] object-contain"
      />

      <div className="mt-4 flex flex-col gap-[3px] text-center">
        <h2 className="text-base font-bold text-gray-900">아직 참여 중인 그룹이 없습니다</h2>
        <p className="text-mobile-caption font-medium leading-[1.3] text-gray-600 lg:text-sm">
          그룹에 참여하거나 새로운 그룹을 만들어
          <br />
          함께 생활을 시작해보세요.
        </p>
      </div>

      <div className="mt-4 flex w-[221px] flex-col">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/group/add')}
          className="h-9 w-full bg-primary-700 text-mobile-label font-bold hover:bg-primary-600"
        >
          그룹 생성
        </Button>

        <GroupOrDivider className="w-full" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/group/join')}
          className="h-9 w-full text-mobile-label font-bold"
        >
          코드 입력
        </Button>
      </div>
    </div>
  );
};
