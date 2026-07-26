import { useEffect, useState } from "react";
import type { FormEvent, SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/auth.api"
import { ApiError } from "@/shared/api";
import { useErrorStore } from "@/shared/store";
import type { SignupFormData } from "@/features/auth/types/auth.type";

interface TermsNavigationState {
    formData?: SignupFormData;
    agreed?: boolean;
}

export const useSignupForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState<1 | 2>(1);

    const [isVerified, setIsVerified] = useState(false);

    const showError = useErrorStore((state) => state.showError);

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

    // 회원가입 요청    
    const handleSubmitInfo = async (e: FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (formData.nickname.trim().length < 2 || formData.nickname.trim().length > 10) {
            showError({ title: '입력 오류', message: '닉네임은 2글자 이상, 10자 이하여야 합니다.' });
            return;
        }

        if (formData.password.trim().length < 8 || formData.password.trim().length > 16) {
            showError({ title: '입력 오류', message: '비밀번호는 8글자 이상, 16자 이하여야 합니다.' });
            return;
        }

        const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
        if (!passwordComplexityRegex.test(formData.password)) {
            showError({ title: '입력 오류', message: '비밀번호는 대문자, 소문자, 숫자를 모두 포함해야 합니다.' });
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            showError({ title: '입력 오류', message: '비밀번호가 일치하지 않습니다.' });
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
                showError({ title: '가입 불가', message: '이미 가입된 이메일입니다.' });
            } else {
                showError({ title: '회원가입 실패', message: '오류가 발생했습니다.' });
            }
        }
    };

    // 이메일 인증 확인 및 가입 완료
    const handleConfirmEmail = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.verificationCode) {
            showError({ title: '입력 오류', message: '이메일과 인증 번호를 모두 입력해주세요.' });
            return;
        }

        try {
            await authApi.signupConfirm({
                email: formData.email,
                confirmationCode: formData.verificationCode,
            });

            setIsCodeError(false);
            setIsVerified(true); // 인증 성공 상태로 변경
            alert('인증이 완료되었습니다.');

        } catch (error) {
            // 실패 시 UI 테두리를 빨갛게 만들기 위해 true로 변경
            setIsCodeError(true); 

            if (error instanceof ApiError && error.statusCode === 400) {
                showError({ title: '인증 실패', message: '인증번호가 일치하지 않습니다.' }); 
            } else {
                showError({ title: '인증 실패', message: '인증에 실패했습니다. 다시 시도해주세요.' });
            }
        }
    }

    const handleFinalSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!isVerified) {
            showError({ title: '안내', message: '이메일 인증을 먼저 완료해주세요.' });
            return;
        }

        // 인증이 완료된 상태에서만 최종 완료 알림 및 이동
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
    }

    // 인증번호 다시 보내기
    const handleResendCode = async () => {
        try {
            // TODO: 재전송 API 호출 구현 필요
            // await authApi.resendCode({ email: formData.email });
            
            setIsCodeError(false); // 에러 상태 초기화
            setFormData(prev => ({ ...prev, verificationCode: '' })); // 인풋창 초기화
            
            alert('인증번호가 재전송되었습니다.');
        } catch {
            showError({ title: '재전송 실패', message: '인증번호 재전송에 실패했습니다.' });
        }
    };

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
        onFormDataChange: setFormData,
        agreedTerms,
        onAgreedTermsChange: setAgreedTerms,
        handleConfirmEmail,
        handleSubmitInfo,
        handleResendCode,
        isCodeError,
        isVerified,      
        handleFinalSubmit
    };
};