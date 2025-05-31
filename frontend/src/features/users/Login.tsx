import {useState} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {Avatar, Box, Button, Link, TextField, Typography, Alert} from "@mui/material";
import Grid from '@mui/material/Grid2';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {LoginMutation} from "../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectLoginError, selectLoginLoading} from "./usersSlice";
import {googleLogin, login} from "./usersThunks";
import {toast} from "react-toastify";
import {GoogleLogin} from "@react-oauth/google";

const Login = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectLoginError);
    const loginLoading = useAppSelector(selectLoginLoading);
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginMutation>({
        email: '',
        password: '',
    });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const onSubmitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(login(form)).unwrap();
            navigate("/");
            toast.success("Login successful");
        } catch (error) {
            console.error(error);
        }
    };

    const googleLoginHandler =  async (credential: string) => {
        await dispatch(googleLogin(credential)).unwrap();
        navigate('/');
        toast.success("Google login successful");
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOpenIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>

            {error && (
                <Alert severity="error">{error.error}</Alert>
            )}

            <Box sx={{pt: 2}}>
                <GoogleLogin
                    onSuccess={(credentialResponse)=> {
                        if (credentialResponse.credential) {
                            void googleLoginHandler(credentialResponse.credential);
                        }

                    }}
                    onError={() => {
                        console.log('Login failed');
                    }}
                />
            </Box>

            <Box component="form" noValidate onSubmit={onSubmitFormHandler} sx={{mt: 3}}>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12}}>
                        <TextField
                            disabled={loginLoading}
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={onInputChange}
                            error={Boolean(error)}
                        />
                    </Grid>
                    <Grid size={{xs: 12}}>
                        <TextField
                            disabled={loginLoading}
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={onInputChange}
                            error={Boolean(error)}
                        />
                    </Grid>
                </Grid>
                <Button
                    disabled={loginLoading}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                    color={'secondary'}
                >
                    Sign In
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid sx={{mx: 'auto'}}>
                        <Link to="/register" variant="body2" component={RouterLink} color={'secondary'}>
                            Don't have an account? Sign Up
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Login;