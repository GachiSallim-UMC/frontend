import { TermsButtonGroup, TermsContent, TermsHeader } from '@/features/auth';
import { SignupLegalPageLayout } from './SignupLegalPageLayout';

export const TermsPage = () => (
  <SignupLegalPageLayout
    Header={TermsHeader}
    Content={TermsContent}
    ButtonGroup={TermsButtonGroup}
  />
);
