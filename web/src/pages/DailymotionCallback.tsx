import * as React from 'react';
import Typography from "@mui/material/Typography";
import colors from "../jsons/colors.json";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import Button from "@mui/material/Button";
import {Header} from "../components/Header";
import {useAuth} from "../context/authContext";
import {getUser} from "../utils/localStorage";

export default function DailymotionCallback() {
    const [code, setCode] = useSearchParams();
    const {currentUser, setCurrentUser, dailymotion} = useAuth()

    const checkCurrentUser = (): string => {
        if (!currentUser) {
            const local = getUser();
            setCurrentUser(local);
            return local.token
        }
        return currentUser.token
    }

    const doFunc = async () => {
        const url = window.location.href
        const start = url.indexOf("code=") + 5;
        const end = url.indexOf("&", start);
        const code = url.slice(start, end)
        const res = checkCurrentUser()
        const codee = JSON.stringify({
            code
        })
        await dailymotion(res, codee)
    }

    useEffect( () => {
        doFunc()
    },[code]);

    return (
        <div style={{marginLeft: "25px", marginTop: "100px", marginBottom: "30px"}}>
            <Header/>
            <Typography sx={{color: colors.White}}>Dailymotion Callback</Typography>
            <Button href={"/profile"}>Back to profile</Button>
        </div>
    );
}
