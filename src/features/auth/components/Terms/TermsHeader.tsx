import { LegalDocumentHeader } from '@/shared/components';

interface TermsHeaderProps {
  onBack: () => void;
  onMobileBack?: () => void;
}

export const TermsHeader = ({ onBack, onMobileBack }: TermsHeaderProps) => (
  <LegalDocumentHeader
    title="이용약관"
    onBack={onBack}
    onMobileBack={onMobileBack}
    variant="signup"
  />
);
