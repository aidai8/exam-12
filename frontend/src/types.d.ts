export interface RegisterMutation {
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
}

export interface User {
    _id: string;
    email: string;
    token: string;
    role: string;
    displayName: string;
    googleID?: string;
    joinedActivities?: string[];
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    },
    message: string;
    name: string;
    _message: string;
}

export interface LoginMutation {
    email: string;
    password: string;
}

export interface GlobalError {
    error: string;
}