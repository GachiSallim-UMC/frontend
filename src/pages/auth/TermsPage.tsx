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

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            <div className="flex h-[696px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
                <TermsHeader onBack={handleCancel}/>
                <TermsContent />
                <TermsButtonGroup 
                    onAgree={handleAgree} 
                    onCancel={handleCancel} 
                />
            </div>
        </div>
    );
};