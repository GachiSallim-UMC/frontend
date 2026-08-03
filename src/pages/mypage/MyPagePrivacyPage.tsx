import { Modal } from '@/shared/components';
import { PrivacyContent, PrivacyHeader } from '@/features/mypage';

interface MyPagePrivacyPageProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MyPagePrivacyPage = ({ isOpen, onClose }: MyPagePrivacyPageProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            dismissible={false}
            className="flex h-[696px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl p-0"
        >
            <PrivacyHeader onBack={onClose} />
            <PrivacyContent />
        </Modal>
    );
};
