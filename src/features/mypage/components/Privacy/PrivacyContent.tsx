import { LegalDocumentContent } from '@/shared/components';
import { PRIVACY_DATA, PRIVACY_INTRO } from '@/shared/constants/legal';

export const PrivacyContent = () => (
  <LegalDocumentContent intro={PRIVACY_INTRO} sections={PRIVACY_DATA} />
);
