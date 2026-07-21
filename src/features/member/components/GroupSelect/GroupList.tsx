import { useNavigate } from "react-router-dom";
import { Button } from '@/shared/components';
import { GroupCard } from "@/features/member/components/GroupSelect/GroupCard";
import { useMyGroups } from "@/features/member/hooks/useMyGroups";
import { useGroupStore } from "@/shared/store";


export const GroupList = () => {
    const navigate = useNavigate();
    const { data: groups, isLoading, isError, isFetching, refetch } = useMyGroups();
    const setSelectedGroupId = useGroupStore(s => s.setSelectedGroupId);

    const handleEnterGroup = (groupId: string) => {
        setSelectedGroupId(groupId);
        navigate('/dashboard');
    };

    if (isLoading) {
        return (
            <div className="flex min-h-40 items-center justify-center rounded-lg border border-gray-100">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                <span className="ml-3 text-sm text-gray-600">그룹을 불러오는 중입니다</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-red-300 bg-red-100 px-4 text-center">
                <p className="text-sm font-medium text-red-700">그룹 목록을 불러오지 못했습니다.</p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    isLoading={isFetching}
                    onClick={() => void refetch()}
                >
                    다시 시도
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <h2 className="mb-2 text-sm font-bold text-gray-800 text-left">참여 중인 그룹</h2>
            {groups.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {groups.map((group) => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            onEnter={handleEnterGroup}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-32 items-center justify-center rounded-lg border border-gray-100 bg-primary-50 px-4 text-center">
                    <p className="text-sm text-gray-600">아직 참여 중인 그룹이 없습니다.</p>
                </div>
            )}
        </div>
    );
};
