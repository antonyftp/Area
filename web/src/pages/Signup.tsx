import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import "../css/font.css"
import "../css/index.css"
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import {useAuth} from "../context/authContext";
import Dialog from "@mui/material/Dialog";
import colors from "../jsons/colors.json";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SignUpConditions from "../components/SignUpConditions";

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
};

const initialStates = {
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
}

export default function Signup() {
    const [data, setData] = useState(initialStates)
    const {currentUser} = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser)
            navigate("/home")
    }, [])

    return (
        <Box>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
                    <Typography component="h1" variant="h5">Sign up</Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField required fullWidth id="name" label="Name" name="name" autoComplete="family-name" onChange={(e) => {setData({...data, name: e.target.value})}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" onChange={(e) => {setData({...data, email: e.target.value})}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" onChange={(e) => {setData({...data, password: e.target.value})}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth name="passwordConfirm" label="Password confirmation" type="password" id="passwordConfirm" autoComplete="new-password" onChange={(e) => {setData({...data, passwordConfirm: e.target.value})}}/>
                            </Grid>
                        </Grid>
                        <SignUpConditions data={data}/>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href={"/"} variant="body2">Already have an account? Sign in</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
