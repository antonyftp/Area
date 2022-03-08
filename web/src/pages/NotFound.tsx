import * as React from 'react';
import Typography from "@mui/material/Typography";
import colors from "../jsons/colors.json"
import {Header} from "../components/Header";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={{marginLeft: "25px", marginTop: "100px", marginBottom: "30px"}}>
            <Header/>
            <Typography sx={{color: colors.White}}>Page not found !</Typography>
        </div>
    );
}