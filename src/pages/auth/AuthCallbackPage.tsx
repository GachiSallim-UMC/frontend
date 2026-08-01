import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/features/auth'
import { useErrorStore, useAuthStore } from '@/shared/store' 

export const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const showError = useErrorStore(state => state.showError);
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

                    if (apiError instanceof Error) {
                        const e = apiError as Error & { 
                            status?: number; 
                            statusCode?: number; 
                            response?: { status?: number } 
                        };
                        status = e.status || e.statusCode || e.response?.status;
                        message = e.message;
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
                showError({ title: '인증 오류', message: '로그인 처리 중 문제가 발생했습니다.' });
                navigate('/login', { replace: true });
            }
        };

        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            showError({ title: '로그인 취소', message: '소셜 로그인이 취소되었거나 실패했습니다.' });
            navigate('/login', { replace: true });
            return;
        }

        if (code && !isProcessed.current) {
            isProcessed.current = true;
            processLogin(code);
        }
        
    }, [searchParams, navigate, showError, setSession]); 

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            <div className="text-lg font-bold text-gray-700">
                로그인 처리 중입니다... 잠시만 기다려주세요.
            </div>
        </div>
    );
};