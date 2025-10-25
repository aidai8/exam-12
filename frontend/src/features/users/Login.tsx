import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectLoginError, selectLoginLoading } from './usersSlice.ts';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { LoginMutation } from '../../types';
import { googleLogin, login } from './usersThunks.ts';
import { Alert, Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const Login = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectLoginError);
    const loading = useAppSelector(selectLoginLoading);
    const navigate = useNavigate();


    const [state, setState] = useState<LoginMutation>({
        email: '',
        password: '',
    });

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const submitFormHandler = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(login(state)).unwrap();
            navigate('/');
        } catch (e) {
            console.log(e);
            // error happened
        }
    };

    const googleLoginHandler = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            await dispatch(googleLogin(credentialResponse.credential)).unwrap();
            navigate('/');
        }
    };

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOpenIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Войти
            </Typography>
            {error && (
                <Alert severity={'error'} sx={{ mt: 3 }}>
                    {error.error}
                </Alert>
            )}
            <Box sx={{ pt: 2 }}>
                <GoogleLogin onSuccess={googleLoginHandler} />
            </Box>
            <Box
                component="form"
                noValidate
                onSubmit={submitFormHandler}
                sx={{ my: 3, maxWidth: '400px', width: '100%' }}
            >
                <Stack spacing={2}>
                    <TextField
                        required
                        label="Email"
                        name="email"
                        value={state.email}
                        onChange={inputChangeHandler}
                        autoComplete="current-email"
                    />
                    <TextField
                        type="password"
                        required
                        label="Password"
                        name="password"
                        value={state.password}
                        onChange={inputChangeHandler}
                        autoComplete="current-password"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, bgcolor: 'secondary.main' }} loading={loading}>
                        Войти
                    </Button>
                </Stack>
            </Box>
            <Link component={RouterLink} to="/register">
                У вас ещё нет аккаунта? Зарегистрироваться
            </Link>
        </Box>
    );
};

export default Login;