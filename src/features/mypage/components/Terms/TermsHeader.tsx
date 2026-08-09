import { LegalDocumentHeader } from '@/shared/components';

interface TermsHeaderProps {
  onBack: () => void;
}

export const TermsHeader = ({ onBack }: TermsHeaderProps) => (
  <LegalDocumentHeader title="이용약관" onBack={onBack} />
);
