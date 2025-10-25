import { type ChangeEvent, type FormEvent, useState } from 'react';
import {Link as RouterLink, useNavigate} from "react-router-dom";
import { Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectRegisterError, selectRegisterLoading} from "./usersSlice.ts";
import {register} from "./usersThunks.ts";
import {RegisterMutation} from "../../types";


const Register = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectRegisterLoading);
    const error = useAppSelector(selectRegisterError);
    const navigate = useNavigate();

    const [state, setState] = useState<RegisterMutation>({
        email: '',
        displayName: '',
        password: '',
    });

    const getFieldError = (fieldName: string) => {
        return error?.errors[fieldName]?.message;
    };

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const submitFormHandler = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(register(state)).unwrap();
            navigate('/');
        } catch (e){
            console.log(e);
        }
    };

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={submitFormHandler} sx={{ my: 3, maxWidth: '400px', width: '100%' }}>
                <Stack spacing={2}>
                    <TextField
                        required
                        label="Email"
                        name="email"
                        value={state.email}
                        onChange={inputChangeHandler}
                        autoComplete="new-email"
                        error={Boolean(getFieldError('email'))}
                        helperText={getFieldError('email')}
                    />
                    <TextField
                        required
                        label="Display name"
                        name="displayName"
                        value={state.displayName}
                        onChange={inputChangeHandler}
                        autoComplete="new-display-name"
                        error={Boolean(getFieldError('displayName'))}
                        helperText={getFieldError('displayName')}
                    />
                    <TextField
                        type="password"
                        required
                        label="Password"
                        name="password"
                        value={state.password}
                        onChange={inputChangeHandler}
                        autoComplete="new-password"
                        error={Boolean(getFieldError('password'))}
                        helperText={getFieldError('password')}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, bgcolor: 'secondary.main' }} loading={loading}>
                        Sign Up
                    </Button>
                </Stack>
            </Box>
            <Link component={RouterLink} to="/login">
                Already have an account? Sign in
            </Link>
        </Box>
    );
};

export default Register;