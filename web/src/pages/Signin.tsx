import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {useAuth} from "../context/authContext";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import {axiosInstance} from "../utils/axios";
import {Nullable} from "../utils/nullable";
import GoogleLoginConditions from "../components/GoogleLoginConditions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
};

const notifyError = (str: string) => toast.error(str, {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});

const Signin = () => {
    const [data, setData] = useState({email: "", password: ""});
    const {currentUser, signin, signinWithGoogle} = useAuth()
    const navigate = useNavigate();
    const [googleClientId, setGoogleClientId] =  useState("null")
    const [error, setError] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get("OAuth/getGoogleCredentials");
                setGoogleClientId(res.data.clientId);
            } catch {
                setError(true)
            }
        })()
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <ToastContainer theme={"dark"}/>
            <CssBaseline />
            <Box sx={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus onChange={(e) => {setData({...data, email: e.target.value})}}/>
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={(e) => {setData({...data, password: e.target.value})}}/>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={async () => {
                        try {
                            await signin(data.email, data.password)
                            navigate("/")
                        } catch (error) {
                            notifyError("Email ou mot de passe incorrect")
                            console.error(error);
                        }
                    }}>Sign In</Button>
                    <Box sx={{display: "flex", justifyContent: "center"}}>
                        <GoogleLoginConditions googleClientId={googleClientId}/>
                    </Box>
                    <Box sx={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                        <Link href={"/signup"}>{"Don't have an account? Sign Up"}</Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default Signin
