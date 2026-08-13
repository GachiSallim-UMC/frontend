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
            className="flex h-[85dvh] w-full max-w-none flex-col overflow-hidden rounded-2xl p-0 lg:h-[696px] lg:max-w-2xl lg:rounded-3xl"
        >
            <PrivacyHeader onBack={onClose} />
            <PrivacyContent />
        </Modal>
    );
};
