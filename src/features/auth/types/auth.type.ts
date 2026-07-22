export interface SignupFormData {
    name: string;
    nickname: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export const INITIAL_SIGNUP_FORM_DATA: SignupFormData = {
    name: '',
    nickname: '',
    email: '',
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

export interface MeResponsePayload {
  userId: string | number;
  name: string;
  nickname: string;
  email: string;
  profileImage?: string | null;
}