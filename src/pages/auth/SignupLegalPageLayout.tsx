import type { ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SignupFormData } from '@/features/auth';

interface SignupNavigationState {
  formData?: SignupFormData;
}

interface LegalHeaderProps {
  onBack: () => void;
  onMobileBack?: () => void;
}

interface LegalButtonGroupProps {
  onAgree: () => void;
  onCancel: () => void;
}

interface SignupLegalPageLayoutProps {
  Header: ComponentType<LegalHeaderProps>;
  Content: ComponentType;
  ButtonGroup: ComponentType<LegalButtonGroupProps>;
}

export const SignupLegalPageLayout = ({
  Header,
  Content,
  ButtonGroup,
}: SignupLegalPageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = (location.state as SignupNavigationState | null)?.formData;

  const returnToSignup = (agreed: boolean) => {
    navigate('/signup', { state: { agreed, formData } });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white lg:min-h-screen lg:items-center lg:justify-center lg:bg-primary-100">
      <div className="flex w-full flex-1 flex-col lg:h-[696px] lg:max-w-2xl lg:flex-none lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:shadow-sm">
        <Header onBack={() => returnToSignup(false)} onMobileBack={() => navigate(-1)} />
        <Content />
        <ButtonGroup onAgree={() => returnToSignup(true)} onCancel={() => returnToSignup(false)} />
      </div>
    </div>
  );
};
