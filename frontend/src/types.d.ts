export interface RegisterMutation {
    email: string;
    displayName: string;
    password: string;
}

export interface User {
    _id: string;
    email: string;
    token: string;
    displayName: string;
    googleID?: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            message: string;
            name: string;
        };
        message: string;
        name: string;
        _message: string;
    };
}

export interface GlobalError {
    error: string;
}

export interface LoginMutation {
    email: string;
    password: string;
}

export interface Recipe{
    _id: string;
    title: string;
    description: string;
    image: string;
    author: {
        _id: string;
        displayName: string;
    };
}

export interface Comment {
    _id: string;
    text: string;
    author: {
        _id: string;
        displayName: string;
    };
    recipe: string;
}