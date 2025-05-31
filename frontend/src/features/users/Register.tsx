import React, {useState} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {Button, TextField} from "@mui/material";
import {RegisterMutation} from "../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectRegisterError, selectRegisterLoading} from "./usersSlice.ts";
import {register} from "./usersThunks.ts";
import {toast} from "react-toastify";


const Register = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectRegisterError);
    const registerLoading = useAppSelector(selectRegisterLoading);
    const navigate = useNavigate();
    const [form, setForm] = useState<RegisterMutation>({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
    });


    const getFieldError = (fieldName: string) => {
        try {
            return error?.errors[fieldName].message;
        } catch (e) {
            return undefined;
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm({ ...form, [name]: value });
    };

    const onSubmitFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('confirmPassword', form.confirmPassword);
            formData.append('displayName', form.displayName);

            await dispatch(register(formData)).unwrap();
            navigate("/");
            toast.success("Registration successful!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box component="form" onSubmit={onSubmitFormHandler}>
            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{xs: 12}}>
                    <TextField
                        fullWidth
                        required
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onInputChange}
                        error={Boolean(getFieldError('email'))}
                        helperText={getFieldError('email')}
                    />
                </Grid>

                <Grid size={{xs: 12}}>
                    <TextField
                        fullWidth
                        required
                        label="Display Name"
                        name="displayName"
                        value={form.displayName}
                        onChange={onInputChange}
                        error={Boolean(getFieldError('displayName'))}
                        helperText={getFieldError('displayName')}
                    />
                </Grid>
                    <Grid size={{xs: 12}}>
                        <TextField
                            disabled={registerLoading}
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={onInputChange}
                            helperText={getFieldError('password')}
                            error={Boolean(getFieldError('password'))}
                        />
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <TextField
                            disabled={registerLoading}
                            fullWidth
                            name="confirmPassword"
                            label="Confirm password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={form.confirmPassword}
                            onChange={onInputChange}
                            helperText={getFieldError('confirmPassword')}
                            error={Boolean(getFieldError('confirmPassword'))}
                        />
                    </Grid>
                </Grid>
                <Button
                    disabled={registerLoading}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    color={'secondary'}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="space-between">
                    <Grid sx={{mx: 'auto'}}>
                        <Link to='/login' variant="body2" component={RouterLink} color={'secondary'}>
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
        </Box>
    );
};

export default Register;