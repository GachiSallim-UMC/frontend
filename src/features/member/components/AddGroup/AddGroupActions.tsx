import { Button } from '@/shared/components';

interface AddGroupActionsProps {
  isCreated: boolean;
  onCreate: () => void;
  onEnter: () => void;
  onCancel: () => void;
}

export const AddGroupActions = ({
    isCreated,
    onCreate,
    onEnter,
    onCancel,
}: AddGroupActionsProps) => {
    return (
        <div className="mt-5 flex gap-5">
            {!isCreated ? (
                <Button
                    variant='primary'
                    size="md"
                    className="flex-[2]"
                    onClick={onCreate}
                >
                    그룹 생성
                </Button>
            ) : (
                <Button
                    variant='primary'
                    size="md"
                    className="flex-[2]"
                    onClick={onEnter}
                >
                    입장
                </Button>
            )}

            <Button 
                variant="outline"
                size="md"
                className="flex-1"
                onClick={onCancel}
            >
                취소
            </Button>
        </div>
    );
};