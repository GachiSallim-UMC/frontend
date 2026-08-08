import { Button } from '@/shared/components';

interface JoinGroupActionProps {
  onJoin: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * 모바일은 디자인대로 "그룹 참여" 버튼만 전체 폭으로,
 * 데스크톱은 기존의 참여 + 취소 2단 배치를 유지합니다.
 */
export const JoinGroupAction = ({ onJoin, onCancel, isSubmitting = false }: JoinGroupActionProps) => (
  <div className="flex gap-5">
    <Button
      variant="primary"
      size="md"
      className="h-11 flex-1 bg-primary-700 text-mobile-body font-bold hover:bg-primary-600 lg:h-[50px] lg:flex-[2] lg:bg-primary-600 lg:text-button lg:hover:bg-primary-700"
      isLoading={isSubmitting}
      onClick={onJoin}
    >
      그룹 참여
    </Button>

    <Button
      variant="outline"
      size="md"
      className="hidden flex-1 lg:inline-flex"
      onClick={onCancel}
    >
      취소
    </Button>
  </div>
);
