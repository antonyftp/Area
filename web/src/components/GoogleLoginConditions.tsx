import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useState, Fragment} from "react";
import {Typography} from "@mui/material";
import colors from "./../jsons/colors.json"
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/authContext";
import {Nullable} from "../utils/nullable";

interface IProps {
    googleClientId: string
}

export default function GoogleLoginConditions(props: IProps) {
    const [open, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xl');
    const navigate = useNavigate();
    const {signinWithGoogle} = useAuth()

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Fragment>
            {props.googleClientId && <Button type="submit" fullWidth variant="contained" sx={{background: "white", width: "250px"}} onClick={() => {
                setOpen(true)
            }}>Sign Up with Google</Button>}
            <Dialog maxWidth={maxWidth} open={open} onClose={handleClose} PaperProps={{style: {backgroundColor: colors.LightGray},}}>
                <DialogTitle  sx={{marginLeft: "auto", marginRight: "auto"}} color={colors.White}>Conditions</DialogTitle>
                <DialogContent sx={{marginLeft: "auto", marginRight: "auto"}}>
                    <Typography>By checking this I accept that Area use my information to identify me and create actions/reactions. I also certify that I am at least 18 years old.</Typography>
                </DialogContent>
                <DialogActions sx={{marginLeft: "auto", marginRight: "auto"}}>
                    <Button sx={{background: "white", borderRadius: "2px", color: "gray", paddingTop: "7px", paddingBottom: "7px"}} onClick={handleClose}>NO</Button>
                    <GoogleLogin clientId={props.googleClientId} icon={false} redirectUri={"http://localhost:8081/oauth/callback/google"} scope={"https://www.googleapis.com/auth/userinfo.email"} cookiePolicy={"single_host_origin"} onSuccess={async (res) => {
                        handleClose();
                        const res_ = res as GoogleLoginResponse
                        try {
                            await signinWithGoogle(res_.profileObj.email, res_.profileObj.name, res_.tokenObj.access_token)
                            navigate("/home")
                        } catch (error) {
                            alert("An error occured, verify your informations and try again")
                            console.error(error);
                        }
                    }}
                        onFailure={(res) => {
                            handleClose();
                            console.error(res)
                    }} buttonText={"OK"}/>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
