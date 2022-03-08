import * as React from 'react';
import Typography from "@mui/material/Typography";
import colors from "../jsons/colors.json";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Button from "@mui/material/Button";
import {Header} from "../components/Header";
import {useAuth} from "../context/authContext";
import {getUser} from "../utils/localStorage";

export default function DiscordCallback() {
    const [code, setCode] = useSearchParams();
    const navigate = useNavigate();
    const {currentUser, setCurrentUser, discord} = useAuth()

    const checkCurrentUser = (): string => {
        if (!currentUser) {
            const local = getUser();
            setCurrentUser(local);
            return local.token
        }
        return currentUser.token
    }

    const doFunc = async () => {
        code.get("code")
        const res = checkCurrentUser()
        const codee = code.toString().slice(5).split("&")
        const codeee = JSON.stringify({
            code: codee[0]
        })
        await discord(res, codeee)
    }

    useEffect( () => {
        doFunc()
    },[code]);

    return (
        <div style={{marginLeft: "25px", marginTop: "100px", marginBottom: "30px"}}>
            <Header/>
            <Typography sx={{color: colors.White}}>Discord Callback</Typography>
            <Button href={"/profile"}>Back to profile</Button>
        </div>
    );
}
