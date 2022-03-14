import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "../context/authContext";
import {getUser} from "../utils/localStorage";
import {useEffect} from "react";
import {Header} from "../components/Header";
import Typography from "@mui/material/Typography";
import colors from "../jsons/colors.json";
import Button from "@mui/material/Button";
import * as React from "react";

export default function TrelloCallback() {
    const [code, setCode] = useSearchParams();
    const navigate = useNavigate();
    const {currentUser, setCurrentUser, trello} = useAuth()

    const doFunc = async () => {
        const url = window.location.href
        const code = url.slice(url.indexOf("token=") + 6)
        const codee = JSON.stringify({
            code
        })
        await trello(codee)
    }

    useEffect( () => {
        doFunc()
    },[code]);

    return (
        <div style={{marginLeft: "25px", marginTop: "100px", marginBottom: "30px"}}>
            <Header/>
            <Typography sx={{color: colors.White}}>Trello Callback</Typography>
            <Button href={"/profile"}>Back to profile</Button>
        </div>
    );
}
