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
            className="flex h-[696px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl p-0"
        >
            <TermsHeader onBack={onClose} />
            <TermsContent />
        </Modal>
    );
};
