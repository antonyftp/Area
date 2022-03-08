import * as React from 'react';
import {Header} from "../components/Header";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import colors from "../jsons/colors.json"

const ClientApk = () => {
  return (
    <div>
        <Header/>
        <Box sx={{marginLeft: "55px", marginTop: "100px"}}>
            <a style={{color: colors.White, textDecoration: "none", backgroundColor: colors.Blue, padding: "10px", borderRadius: "5px"}} href="/mobileapp/app.apk" download={'client.apk'} target="_blank">
                Download Client Apk
            </a>
        </Box>
    </div>
  );
};

export default ClientApk;