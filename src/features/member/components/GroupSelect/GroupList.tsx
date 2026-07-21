import { useNavigate } from "react-router-dom";
import { GroupCard } from "@/features/member/components/GroupSelect/GroupCard";
import { groups } from "@/pages/_shared/mockData";


export const GroupList = () => {
    const navigate = useNavigate();
    const handleEnterGroup = () => {
        {/* 이후 /dashboard/:id로 수정*/}
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col">
            <h2 className="mb-2 text-sm font-bold text-gray-800 text-left">참여 중인 그룹</h2>
            <div className="grid grid-cols-2 gap-3">
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        group={group}
                        onEnter={handleEnterGroup}
                    />
                ))}
            </div>
        </div>
    );
};