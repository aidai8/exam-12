import {createAsyncThunk} from "@reduxjs/toolkit";
import {GlobalError, LoginMutation, User, ValidationError} from "../../types";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

export interface RegisterAndLoginResponse {
    user: User;
    message: string;
    accessToken: string;
}

export const register = createAsyncThunk<
    RegisterAndLoginResponse,
    FormData,
    { rejectValue: ValidationError }
>(
    'users/register',
    async (registerData, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post('/users', registerData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status === 400) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }
    }
);

export const login = createAsyncThunk<
    RegisterAndLoginResponse,
    LoginMutation,
    { rejectValue: GlobalError}
>(
    'users/login',
    async (loginForm, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post<RegisterAndLoginResponse>('/users/sessions', loginForm);
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status === 400) {
                return rejectWithValue(error.response.data);
            }

            throw error;
        }
    }
)

export const googleLogin = createAsyncThunk<
    RegisterAndLoginResponse,
    string,
    { rejectValue: GlobalError}
>(
    'users/googleLogin',
    async (credential, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post<RegisterAndLoginResponse>('/users/google', {credential});
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status === 400) {
                return rejectWithValue(error.response.data);
            }

            throw error;
        }
    }
)

export const logout = createAsyncThunk<
    void,
    void
>(
    'users/logout',
    async () => {
        await axiosApi.delete('users/sessions', {withCredentials: true});
    }
)