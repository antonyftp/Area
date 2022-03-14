import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useState, Fragment} from "react";
import {Typography} from "@mui/material";
import colors from "./../jsons/colors.json"
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/authContext";

const displaySuccess = () => {
    alert("Your registration has been taken into account.")
}

interface IProps {
    data: {email: string, password: string, passwordConfirm: string, name: string}
}

export default function SignUpConditions(props: IProps) {
    const [open, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xl');
    const navigate = useNavigate();
    const {signup, signin} = useAuth()

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Fragment>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={async () => {
                if (props.data.name === "" || props.data.email === "" || props.data.password === "" || props.data.passwordConfirm === "")
                    alert("Please complete all informations and try again")
                else if (props.data.password === props.data.passwordConfirm)
                    setOpen(true)
                else
                    alert("The passwords are not the same, please correct it and try again.")
            }}>Sign Up</Button>
            <Dialog maxWidth={maxWidth} open={open} onClose={handleClose} PaperProps={{style: {backgroundColor: colors.LightGray},}}>
                <DialogTitle  sx={{marginLeft: "auto", marginRight: "auto"}} color={colors.White}>Conditions</DialogTitle>
                <DialogContent sx={{marginLeft: "auto", marginRight: "auto"}}>
                    <Typography>By checking this I accept that Area use my information to identify me and create actions/reactions. I also certify that I am at least 18 years old.</Typography>
                </DialogContent>
                <DialogActions sx={{marginLeft: "auto", marginRight: "auto"}}>
                    <Button variant={"contained"} onClick={handleClose}>BACK</Button>
                    <Button variant={"contained"} onClick={async () => {
                        handleClose();
                        try {
                            await signup(props.data.email, props.data.password, props.data.name)
                            displaySuccess()
                            await signin(props.data.email, props.data.password)
                            navigate("/")
                        } catch (error) {
                            alert("An error occured, verify your informations and try again")
                            console.error(error);
                        }}}>OK</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
