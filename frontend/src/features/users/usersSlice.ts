import {GlobalError, User, ValidationError} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store.ts";
import {googleLogin, login, register} from "./usersThunks.ts";

interface UsersState {
    user: User | null;
    accessToken: string | null;
    registerLoading: boolean;
    registerError: ValidationError | null;
    loginLoading: boolean;
    loginError: GlobalError | null;
}

const initialState: UsersState = {
    user: null,
    accessToken: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
}

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        unsetUser: (state) => {
            state.user = null;
        },
        setAccessToken: (state, {payload}) => {
            state.accessToken = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.registerLoading = true;
                state.registerError = null;
            })
            .addCase(register.fulfilled, (state, {payload}) => {
                state.user = payload.user;
                state.accessToken = payload.accessToken;
                state.registerLoading = false;
            })
            .addCase(register.rejected, (state, {payload: error}) => {
                state.registerLoading = false;
                state.registerError = error || null;
            })

            .addCase(login.pending, (state) => {
                state.loginLoading = true;
                state.loginError = null;
            })
            .addCase(login.fulfilled, (state, {payload}) => {
                state.user = payload.user;
                state.accessToken = payload.accessToken;
                state.loginLoading = false;
            })
            .addCase(login.rejected, (state, {payload: error}) => {
                state.loginLoading = false;
                state.loginError = error || null;
            })
            .addCase(googleLogin.pending, (state) => {
                state.loginLoading = true;
                state.loginError = null;
            })
            .addCase(googleLogin.fulfilled, (state, {payload}) => {
                state.user = payload.user;
                state.accessToken = payload.accessToken;
                state.loginLoading = false;
            })
            .addCase(googleLogin.rejected, (state, {payload: error}) => {
                state.loginLoading = false;
                state.loginError = error || null;
            })
    }
});

export const usersReducer = usersSlice.reducer;
export const {unsetUser, setAccessToken} = usersSlice.actions;