import { LegalDocumentContent } from '@/shared/components';
import { TERMS_DATA, TERMS_INTRO } from '@/shared/constants/legal';

export const TermsContent = () => <LegalDocumentContent intro={TERMS_INTRO} sections={TERMS_DATA} />;
