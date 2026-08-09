import { PrivacyButtonGroup, PrivacyContent, PrivacyHeader } from '@/features/auth';
import { SignupLegalPageLayout } from './SignupLegalPageLayout';

export const PrivacyPage = () => (
  <SignupLegalPageLayout
    Header={PrivacyHeader}
    Content={PrivacyContent}
    ButtonGroup={PrivacyButtonGroup}
  />
);
