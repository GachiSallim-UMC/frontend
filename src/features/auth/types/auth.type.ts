import type { AccountProfile } from '@/shared/types';

export interface SignupFormData {
  name: string;
  nickname: string;
  email: string;
  verificationCode: string;
  password: string;
  passwordConfirm: string;
}

export const INITIAL_SIGNUP_FORM_DATA: SignupFormData = {
  name: '',
  nickname: '',
  email: '',
  verificationCode: '',
  password: '',
  passwordConfirm: '',
};

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponsePayload {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export type MeResponsePayload = AccountProfile;

export interface SignupDto {
  email: string;
  password?: string;
  name: string;
  nickname: string;
}

export interface SignupConfirmDto {
  email: string;
  confirmationCode: string;
}

export interface SignupResendDto {
  email: string;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;

export interface SocialFormDto {
  name: string;
  nickname: string;
}

export const INITIAL_SOCIAL_FORM_DATA: SocialFormDto = {
  name: '',
  nickname: '',
};

export type SocialProvider = 'Kakao' | 'Google';

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  confirmationCode: string;
  newPassword: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  newPasswordConfirm: string;
}
