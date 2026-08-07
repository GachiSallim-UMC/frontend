import { useNavigate, useLocation } from "react-router-dom";
import type {SignupFormData} from '@/features/auth'
import { TermsHeader, TermsContent, TermsButtonGroup } from "@/features/auth";

interface SignupNavigationState {
    formData?: SignupFormData
}

export const TermsPage = () => {
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
                <TermsHeader onBack={handleCancel} onMobileBack={handleMobileBack}/>
                <TermsContent />
                <TermsButtonGroup
                    onAgree={handleAgree}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};