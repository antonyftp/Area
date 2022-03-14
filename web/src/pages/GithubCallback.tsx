import * as React from 'react';
import Typography from "@mui/material/Typography";
import colors from "../jsons/colors.json";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Button from "@mui/material/Button";
import {Header} from "../components/Header";
import {useAuth} from "../context/authContext";
import {getUser} from "../utils/localStorage";

export default function GithubCallback() {
    const [code, setCode] = useSearchParams();
    const navigate = useNavigate();
    const {currentUser, setCurrentUser, github} = useAuth()

    const doFunc = async () => {
        code.get("code")
        const codee = JSON.stringify({
                code: code.toString().slice(5)
            })
        await github(codee)
    }

    useEffect( () => {
        doFunc()
    },[code]);

    return (
        <div style={{marginLeft: "25px", marginTop: "100px", marginBottom: "30px"}}>
            <Header/>
            <Typography sx={{color: colors.White}}>Github Callback</Typography>
            <Button href={"/profile"}>Back to profile</Button>
        </div>
    );
}
