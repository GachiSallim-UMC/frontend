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