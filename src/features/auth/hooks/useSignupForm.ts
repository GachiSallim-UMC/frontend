import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { INITIAL_SIGNUP_FORM_DATA } from "@/features/auth/types/auth.type"
import type { SignupFormData } from "@/features/auth/types/auth.type";

interface TermsNavigationState {
    formData?: SignupFormData;
    agreed?: boolean;
}

export const useSignupForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState<SignupFormData>(INITIAL_SIGNUP_FORM_DATA);
    const [agreedTerms, setAgreedTerms] = useState<string[]>([]);

    // 이용약관 페이지에서 돌아왔을 때 입력값 & 동의 상태 복원
    useEffect(() => {
        const state = location.state as TermsNavigationState | null;
        if (!state) return;

        if (state.formData) {
            setFormData(state.formData);
        }

        if (state.agreed !== undefined) {
            setAgreedTerms(state.agreed ? ['terms'] : []);
        }

        navigate(location.pathname, { replace: true, state: null });
    }, [location.state, location.pathname, navigate]);

    return {
        formData,
        onFormDataChange: setFormData,
        agreedTerms,
        onAgreedTermsChange: setAgreedTerms,
    };
};