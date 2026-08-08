import { Button } from '@/shared/components';

interface AddGroupActionsProps {
  isCreated: boolean;
  onCreate: () => void;
  onEnter: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * 모바일은 디자인대로 주 버튼만 전체 폭으로 두고,
 * 데스크톱은 기존의 주 버튼 + 취소 2단 배치를 유지합니다.
 */
export const AddGroupActions = ({
  isCreated,
  onCreate,
  onEnter,
  onCancel,
  isSubmitting = false,
}: AddGroupActionsProps) => (
  <div className="flex gap-5">
    <Button
      variant="primary"
      size="md"
      className="h-11 flex-1 bg-primary-700 text-mobile-body font-bold hover:bg-primary-600 lg:h-[50px] lg:flex-[2] lg:bg-primary-600 lg:text-button lg:hover:bg-primary-700"
      isLoading={isSubmitting}
      onClick={isCreated ? onEnter : onCreate}
    >
      {isCreated ? '입장' : '그룹 생성'}
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
