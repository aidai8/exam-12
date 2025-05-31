export interface UserFields {
    email: string;
    password: string;
    token: string;
    role: string;
    displayName: string;
    googleID?: string;
    __confirmPassword: string;
}