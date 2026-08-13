import { LegalDocumentHeader } from '@/shared/components';

interface PrivacyHeaderProps {
  onBack: () => void;
  onMobileBack?: () => void;
}

export const PrivacyHeader = ({ onBack, onMobileBack }: PrivacyHeaderProps) => (
  <LegalDocumentHeader
    title="개인정보 처리방침"
    onBack={onBack}
    onMobileBack={onMobileBack}
    variant="signup"
  />
);
