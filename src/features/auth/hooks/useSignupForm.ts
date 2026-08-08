import { useEffect, useState } from "react";
import type { FormEvent, SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/auth.api"
import { ApiError } from "@/shared/api";
import { NICKNAME_PATTERN, NICKNAME_PATTERN_MESSAGE } from "@/shared/lib/inputValidation";
import { useAlertStore } from "@/shared/store";
import type { SignupFormData, SignupFormErrors } from "@/features/auth/types/auth.type";

interface TermsNavigationState {
    formData?: SignupFormData;
    agreed?: boolean;
}

export const useSignupForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState<1 | 2>(1);

    const [isVerified, setIsVerified] = useState(false);

    const showAlert = useAlertStore((state) => state.showAlert);

    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        nickname: '',
        email: '',
        verificationCode: '',
        password: '',
        passwordConfirm: '',
    });
    const [agreedTerms, setAgreedTerms] = useState<string[]>([]);

    const [isCodeError, setIsCodeError] = useState(false);
    const [errors, setErrors] = useState<SignupFormErrors>({});

    const handleFormDataChange = (nextData: SignupFormData) => {
        setFormData(previous => {
            const changedFields = (Object.keys(nextData) as (keyof SignupFormData)[]).filter(
                field => previous[field] !== nextData[field],
            );
            if (changedFields.length > 0) {
                setErrors(previousErrors => {
                    const nextErrors = { ...previousErrors };
                    changedFields.forEach(field => delete nextErrors[field]);
                    return nextErrors;
                });
            }
            return nextData;
        });
    };

    // 회원가입 요청    
    const handleSubmitInfo = async (e: FormEvent) => {
        e.preventDefault();

        const nextErrors: SignupFormErrors = {};
        const trimmedName = formData.name.trim();
        const trimmedNickname = formData.nickname.trim();
        if (!trimmedName) nextErrors.name = '이름을 입력해 주세요.';
        else if (trimmedName.length > 30) nextErrors.name = '이름은 30자 이하로 입력해 주세요.';
        if (!trimmedNickname) nextErrors.nickname = '닉네임을 입력해 주세요.';
        else if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            nextErrors.nickname = '닉네임은 2자 이상 10자 이하로 입력해 주세요.';
        } else if (!NICKNAME_PATTERN.test(trimmedNickname)) {
            nextErrors.nickname = NICKNAME_PATTERN_MESSAGE;
        }
        if (!formData.email.trim()) nextErrors.email = '이메일을 입력해 주세요.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = '올바른 이메일 형식으로 입력해 주세요.';
        }
        const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S+$/;
        if (!formData.password) nextErrors.password = '비밀번호를 입력해 주세요.';
        else if (formData.password.length < 8 || formData.password.length > 16) {
            nextErrors.password = '비밀번호는 8자 이상 16자 이하로 입력해 주세요.';
        } else if (!passwordComplexityRegex.test(formData.password)) {
            nextErrors.password = '영문 대문자·소문자·숫자를 포함하고 공백 없이 입력해 주세요.';
        }
        if (!formData.passwordConfirm) nextErrors.passwordConfirm = '비밀번호를 다시 입력해 주세요.';
        else if (formData.password !== formData.passwordConfirm) {
            nextErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        try {
            await authApi.signup({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                nickname: formData.nickname,
            });
            
            // 1단계 성공 시 2단계로 이동 및 에러 상태 초기화
            setStep(2);
            setIsCodeError(false);

        } catch (error) {
            if (error instanceof ApiError && error.statusCode === 409) {
                showAlert({ title: '가입 불가', message: '이미 가입된 이메일입니다.' });
            } else {
                showAlert({ title: '회원가입 실패', message: '오류가 발생했습니다.' });
            }
        }
    };

    // 이메일 인증 확인 및 가입 완료
    const handleConfirmEmail = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (!/^\d{6}$/.test(formData.verificationCode)) {
            setErrors(previous => ({
                ...previous,
                verificationCode: '인증번호 6자리를 숫자로 입력해 주세요.',
            }));
            return;
        }

        try {
            await authApi.signupConfirm({
                email: formData.email,
                confirmationCode: formData.verificationCode,
            });

            setIsCodeError(false);
            setIsVerified(true); // 인증 성공 상태로 변경
            showAlert({ title: '완료', message: '인증이 완료되었습니다.', tone: 'success' });

        } catch (error) {
            // 실패 시 UI 테두리를 빨갛게 만들기 위해 true로 변경
            setIsCodeError(true); 
            setErrors(previous => ({ ...previous, verificationCode: '인증번호가 일치하지 않습니다.' }));

            if (error instanceof ApiError && error.statusCode === 400) {
                showAlert({ title: '인증 실패', message: '인증번호가 일치하지 않습니다.' }); 
            } else {
                showAlert({ title: '인증 실패', message: '인증에 실패했습니다. 다시 시도해주세요.' });
            }
        }
    }

    const handleFinalSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!isVerified) {
            showAlert({ title: '안내', message: '이메일 인증을 먼저 완료해주세요.' });
            return;
        }

        // 인증이 완료된 상태에서만 최종 완료 알림 및 이동
        showAlert({ title: '완료', message: '회원가입이 완료되었습니다.', tone: 'success' });
        navigate('/login');
    }

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
        step,
        formData,
        errors,
        onFormDataChange: handleFormDataChange,
        agreedTerms,
        onAgreedTermsChange: setAgreedTerms,
        handleConfirmEmail,
        handleSubmitInfo,
        isCodeError,
        isVerified,      
        handleFinalSubmit
    };
};
