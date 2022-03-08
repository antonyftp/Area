import * as React from 'react';
import Typography from "@mui/material/Typography";
import colors from "../jsons/colors.json";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import Button from "@mui/material/Button";
import {Header} from "../components/Header";

export default function GoogleCallback() {
    const [code, setCode] = useSearchParams();

    useEffect( () => {
        (async () => {
            if (code.has("token"))
                return
            code.get("token")
        })()
    },[code]);

    return (
        <div style={{marginLeft: "25px", marginTop: "100px", marginBottom: "30px"}}>
            <Header/>
            <Typography sx={{color: colors.White}}>Callback</Typography>
            <Button href={"/profile"}>Back to profile</Button>
        </div>
    );
}
