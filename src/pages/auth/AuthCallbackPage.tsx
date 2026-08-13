import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi, OAUTH_STATE_STORAGE_KEY } from '@/features/auth'
import { ApiError } from '@/shared/api'
import { useAlertStore, useAuthStore } from '@/shared/store'

export const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const showAlert = useAlertStore(state => state.showAlert);
    const setSession = useAuthStore(state => state.setSession);
    
    const isProcessed = useRef(false);

    useEffect(() => {
        const processLogin = async (code: string) => {
            try {
                const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN_URL;
                const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
                const redirectUri = `${window.location.origin}/auth/callback`;

                const tokenParams = new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    code: code,
                });

                const tokenResponse = await fetch(`${cognitoDomain}/oauth2/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: tokenParams.toString(),
                });

                if (!tokenResponse.ok) {
                    throw new Error('Cognito 토큰 발급에 실패했습니다.');
                }

                const tokenData = await tokenResponse.json();
                
                const accessToken = tokenData.access_token;
                const idToken = tokenData.id_token;
                const refreshToken = tokenData.refresh_token; 
                const expiresIn = tokenData.expires_in;

                const payload = JSON.parse(atob(idToken.split('.')[1]));
                const email = payload.email;
                let provider = 'Kakao';
                if (payload.identities && payload.identities.length > 0) {
                    provider = payload.identities[0].providerName; // 'Google' 또는 'Kakao'
                }

                try {
                    const userData = await authApi.me(accessToken);

                    setSession({
                        accessToken,
                        idToken,
                        refreshToken,
                        expiresIn,
                        userId: String(userData.userId),
                    });
                    navigate('/group', { replace: true });

                } catch (apiError: unknown) {
                    let status: number | undefined;
                    let message = '';

                    if (apiError instanceof ApiError) {
                        status = apiError.statusCode;
                        message = apiError.message;
                    } else if (apiError instanceof Error) {
                        message = apiError.message;
                    }

                    if (status === 404 || message.includes('찾을 수 없습니다')) {
                        navigate('/social-signup', { 
                            state: { 
                                provider, 
                                email, 
                                accessToken,
                                idToken,
                                refreshToken,
                                expiresIn
                            },
                            replace: true
                        });
                    } else {
                        throw apiError; 
                    }
                }
            } catch { 
                showAlert({ title: '인증 오류', message: '로그인 처리 중 문제가 발생했습니다.' });
                navigate('/login', { replace: true });
            }
        };

        if (isProcessed.current) return;

        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const returnedState = searchParams.get('state');

        if (error) {
            isProcessed.current = true;
            sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);
            showAlert({ title: '로그인 취소', message: '소셜 로그인이 취소되었거나 실패했습니다.' });
            navigate('/login', { replace: true });
            return;
        }

        if (!code) return;

        // CSRF 방지: 콜백으로 돌아온 state가 로그인 시작 시 저장해둔 값과 일치할 때만 code를 처리
        const expectedState = sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
        sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);

        if (!returnedState || !expectedState || returnedState !== expectedState) {
            isProcessed.current = true;
            showAlert({ title: '인증 오류', message: '로그인 요청을 확인할 수 없습니다. 다시 로그인해주세요.' });
            navigate('/login', { replace: true });
            return;
        }

        isProcessed.current = true;
        processLogin(code);

    }, [searchParams, navigate, showAlert, setSession]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            <div className="text-lg font-bold text-gray-700">
                로그인 처리 중입니다... 잠시만 기다려주세요.
            </div>
        </div>
    );
};