import { LegalDocumentHeader } from '@/shared/components';

interface PrivacyHeaderProps {
  onBack: () => void;
}

export const PrivacyHeader = ({ onBack }: PrivacyHeaderProps) => (
  <LegalDocumentHeader title="개인정보 처리방침" onBack={onBack} />
);
