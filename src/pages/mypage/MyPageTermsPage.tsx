import { Modal } from '@/shared/components';
import { TermsContent, TermsHeader } from '@/features/mypage';

interface MyPageTermsPageProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MyPageTermsPage = ({ isOpen, onClose }: MyPageTermsPageProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            dismissible={false}
            className="flex h-[85dvh] w-full max-w-none flex-col overflow-hidden rounded-2xl p-0 lg:h-[696px] lg:max-w-2xl lg:rounded-3xl"
        >
            <TermsHeader onBack={onClose} />
            <TermsContent />
        </Modal>
    );
};
