import { useNavigate, useLocation } from "react-router-dom";
import type {SignupFormData} from '@/features/auth'
import { PrivacyHeader, PrivacyContent, PrivacyButtonGroup } from "@/features/auth";

interface SignupNavigationState {
    formData?: SignupFormData
}

export const PrivacyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const formData = (location.state as SignupNavigationState | null)?.formData;

    const handleAgree = () => {
        navigate('/signup', { state: { agreed: true, formData } });
    };

    const handleCancel = () => {
        navigate('/signup', { state: { agreed: false, formData } });
    };

    const handleMobileBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex min-h-dvh flex-col bg-white lg:min-h-screen lg:items-center lg:justify-center lg:bg-primary-100">
            <div className="flex w-full flex-1 flex-col lg:h-[696px] lg:max-w-2xl lg:flex-none lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:shadow-sm">
                <PrivacyHeader onBack={handleCancel} onMobileBack={handleMobileBack}/>
                <PrivacyContent />
                <PrivacyButtonGroup
                    onAgree={handleAgree}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};