import { Button } from '@/shared/components';

interface JoinGroupActionProps {
  onJoin: () => void;
  onCancel: () => void;
}

export const JoinGroupAction = ({ onJoin, onCancel }: JoinGroupActionProps) => {

    return (
        <div className="mt-5 flex gap-5">
            <Button
                variant='primary'
                size="md"
                className="flex-[2]"
                onClick={onJoin}
            >
                그룹 참여
            </Button>

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